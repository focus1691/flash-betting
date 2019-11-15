import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { placeOrder } from "../../actions/order";
import { calcBackProfit } from "../../utils/Bets/BettingCalculations";
import { isHedgingOnSelectionAvailable } from "../../utils/TradingStategy/HedingCalculator";
import { selectionHasBets } from "../../utils/Bets/SelectionHasBets";
import crypto from 'crypto'

const GridDetailCell = props => {

  const selectionMatchedBets = Object.values(props.bets.matched).filter(bet => parseInt(bet.selectionId) === parseInt(props.runner.selectionId))

  const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) > 0 ? "BACK" : "LAY"

  const hedgeSize = selectionMatchedBets !== undefined ?
    selectionMatchedBets.reduce((a, b) => {
      return a + b.size
    }, 0) : 0;

  const handleImageError = () => e => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(props.sportId));
  };

  return (
    <td
      className="grid-runner-details"
      onClick={e => {
        props.onSelectRunner(props.runner);
      }}
    >
      <img src={props.logo} alt={""} onError={handleImageError()} />
      <span>{`${props.number}${props.name}`}</span>
      <span style={{ background: props.bg }}>{props.ltp[0] ? props.ltp[0] : ""}</span>

      <div className={"grid-pl"}>
        <span style={{
          color: !isHedgingOnSelectionAvailable(props.market.marketId, props.runner.selectionId, props.bets)
            ? "#D3D3D3" : props.hedge < 0 ? "red" : "#01CC41"
        }}
          onClick={() => {
            if (isHedgingOnSelectionAvailable(props.market.marketId, props.runner.selectionId, props.bets)) {
              const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15)
              props.onPlaceOrder({
                marketId: props.market.marketId,
                side: side,
                size: hedgeSize,
                price: props.ltp[0],
                selectionId: props.runner.selectionId,
                customerStrategyRef: referenceStrategyId,
                unmatchedBets: props.bets.unmatched,
                matchedBets: props.bets.matched,
              });
            }
          }}>
          {selectionHasBets(props.market.marketId, props.runner.selectionId, props.bets) ? props.hedge : ''}
        </span>
        <span style={{ color: props.PL.color }}>{props.PL.val}</span>
        <span>{props.tv[0] ? Math.floor(props.tv[0]).toLocaleString() : ""}</span>
      </div>
    </td>
  );
};

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(actions.setRunner(runner)),
    onPlaceOrder: order => dispatch(placeOrder(order)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridDetailCell);