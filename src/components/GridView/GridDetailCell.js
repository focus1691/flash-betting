import React from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { iconForEvent } from "../../utils/EventIcons";
import { placeOrder } from "../../actions/order";
import { calcBackProfit } from "../../utils/PriceCalculator";
import crypto from 'crypto'

const GridDetailCell = props => {

  const selectionMatchedBets = Object.values(props.bets.matched).filter(bet => parseInt(bet.selectionId) === parseInt(props.runner.selectionId))

  const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) > 0 ? "BACK" : "LAY"

  const hedgeSize = selectionMatchedBets !== undefined ?
  selectionMatchedBets.reduce((a, b) => {
      return a + b.size
  }, 0) : 0

  return (
    <td
      className="grid-runner-details"
      onClick={e => {
        props.onSelectRunner(props.runner);
      }}
    >
      <img src={props.logo} onError={e => {
        e.target.onerror = null;
        e.target.src = iconForEvent(parseInt(props.sportId));
      }} />
      <span>{`${props.number}${props.name}`}</span>
      <span style={{ background: props.bg }}>{props.ltp[0] ? props.ltp[0] : ""}</span>

      <div className={"grid-pl"}>
      <span style={{ color: props.hedge < 0 ? "red" : "#01CC41" }}
        onClick={() => {
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
          })
        }}>
        {props.ltp[0] ? props.hedge : ''}
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
