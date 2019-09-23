import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../actions/order";
import * as actions2 from "../../actions/market";
import { formatOdds } from "../../utils/ladder/CreateFullLadder";
import LadderHeader from "./Header";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";

const Ladders = props => {
  const tableRef = useRef(null);

  const createLadder = () => {
    return Object.keys(props.ladder).map(key => {
      const ladder = props.ladder[key].fullLadder;
      const ltp = props.ladder[key].ltp;
      const tv = props.ladder[key].tv[0]
        ? props.ladder[key].tv[0].toLocaleString()
        : "";

      return (
        <div className="odds-table">
          <LadderHeader
            runner={props.runners[key]}
            runnerClick={e => {
              props.onSelectRunner(props.runners[key]);
            }}
          />

          <div className={"ladder"}>
            <table ref={tableRef}>
              <tbody>
                <PercentageRow
                  ltp={ltp}
                  tv={tv}
                />
                {renderData(ladder, key)}
                <PriceRow/>
              </tbody>
            </table>
          </div>
          {renderOrderRow()}
        </div>
      );
    });
  };

  const placeOrder = (side, price, selectionId) => {
    props.onPlaceOrder({
      marketId: props.market.marketId,
      side: side,
      size: 5,
      price: price,
      selectionId: selectionId
    });
  };

  const renderData = (ladder, selectionId) => {
    return Object.keys(ladder).map(key => {
      return (
        <tr key={ladder[key].odds}>
          <td className={"candle-stick-col"} colSpan={2}>
            <img src={`${window.location.origin}/icons/green-candle.png`} />
          </td>
          <td>{ladder[key].backProfit}</td>
          <td
            onClick={e =>
              placeOrder("BACK", formatOdds(ladder[key].odds), selectionId)
            }
          >
            {ladder[key].backMatched}
          </td>
          <td>{formatOdds(ladder[key].odds)}</td>
          <td
            onClick={e => {
              placeOrder("LAY", formatOdds(ladder[key].odds), selectionId);
            }}
          >
            {ladder[key].layMatched}
          </td>
          <td>{ladder[key].layProfit}</td>
        </tr>
      );
    });
  };

  const renderOrderRow = () => {
    return (
      <div className={"order-row"}>
        <table>
          <tbody>
            <td colSpan={3} rowSpan={4}>
              <table className="lay-table">
                <tbody>
                  <tr>
                    <td>Order 1</td>
                  </tr>
                  <tr>
                    <td>Order 2</td>
                  </tr>
                  <tr>
                    <td>Order 3</td>
                  </tr>
                  <tr>
                    <td>Order 4</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan={1} rowSpan={4}>
              <button>0</button>
              <button>S</button>
              <button>K</button>
            </td>
            <td colSpan={3} rowSpan={4}>
              <table className="lay-table">
                <tbody>
                  <tr>
                    <td>Order 1</td>
                  </tr>
                  <tr>
                    <td>Order 2a</td>
                  </tr>
                  <tr>
                    <td>Order 3</td>
                  </tr>
                  <tr>
                    <td>Order 4</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className={"ladder-container"}>
      {props.marketOpen && props.ladder ? createLadder() : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentEvent: state.sports.currentSport.currentEvent,
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    runners: state.market.runners,
    ladder: state.market.ladder,
    bets: state.order.bets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(actions2.setRunner(runner)),
    onPlaceOrder: order => dispatch(actions.placeOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);
