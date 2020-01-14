import crypto from 'crypto';
import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { placeOrder } from "../../actions/order";
import { calcBackProfit } from "../../utils/Bets/BettingCalculations";
import { selectionHasBets } from "../../utils/Bets/SelectionHasBets";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { isHedgingOnSelectionAvailable } from "../../utils/TradingStategy/HedingCalculator";
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';

const GridDetailCell = props => {

  const selectionMatchedBets = Object.values(props.bets.matched).filter(bet => parseInt(bet.selectionId) === parseInt(props.runner.selectionId))

  const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) <= 0 ? "BACK" : "LAY"



  const handleImageError = () => e => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(props.sportId));
  };

  const executeHedgeBet = () => e => {
    if (isHedgingOnSelectionAvailable(props.market.marketId, props.runner.selectionId, props.bets)) {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
      const hedgeSize = selectionMatchedBets.length > 0 ? CalculateLadderHedge(props.ltp[0], selectionMatchedBets, 'hedged').size : undefined; 

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
  };

  return (
    <td
      className="grid-runner-details"
      onClick={props.onSelectRunner(props.runner)}
    >
      <img src={props.logo} alt={""} onError={handleImageError()} />
      <span>{`${props.number}${props.name}`}</span>
      <span style={props.ltpStyle}>{props.ltp[0] ? props.ltp[0] : ""}</span>

      <div className={"grid-pl"}>
        <span style={{
          color: !isHedgingOnSelectionAvailable(props.market.marketId, props.runner.selectionId, props.bets)
            ? "#D3D3D3" : props.hedge < 0 ? "red" : "#01CC41"
        }}
          onClick={executeHedgeBet()}>
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
    onSelectRunner: runner => e => dispatch(actions.setRunner(runner)),
    onPlaceOrder: order => dispatch(placeOrder(order)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GridDetailCell);