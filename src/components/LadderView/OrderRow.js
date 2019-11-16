import React from "react";
import { connect } from "react-redux";
import { changePriceType } from '../../actions/market';
import { cancelOrder } from "../../actions/order";
import { combineUnmatchedOrders } from "../../utils/Bets/CombineUnmatchedOrders";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { calcBackProfit } from "../../utils/Bets/BettingCalculations";

const OrderRow = props => {

  const matchedBets = Object.values(props.bets.matched).filter(order => parseFloat(order.selectionId) === parseFloat(props.selectionId));
  const allUnmatchedBets = combineUnmatchedOrders(props.backList, props.layList, props.stopEntryList, props.tickOffsetList, props.stopLossList, props.bets.unmatched)[props.selectionId]
  const unmatchedBetsArr = allUnmatchedBets ? Object.values(allUnmatchedBets) : []

  return (
    <div className={"order-row"}>
      <table>
        <tbody>
          <td colSpan={3} rowSpan={4} style={{ verticalAlign: 'top' }}>
            <table className="lay-table">
              <tbody className={unmatchedBetsArr.length > 0 ? "lay-body" : ""}>
                {unmatchedBetsArr.map(rfs =>
                  rfs.map(bet => {

                    let specialSuffix = "";
                    if (bet.trailing && bet.hedged) specialSuffix = "th"
                    else if (!bet.trailing && bet.hedged) specialSuffix = "h"
                    else if (bet.trailing && !bet.hedged) specialSuffix = "t"

                    const suffix = (bet.strategy == "Stop Loss" ? "SL " :
                      bet.strategy === "Tick Offset" ? "T.O." :
                        bet.strategy === "Back" ? "B" :
                          bet.strategy === "Lay" ? "L" :
                            bet.strategy === "Stop Entry" ? bet.stopEntryCondition + formatPrice(bet.targetLTP) + "SE" :
                              calcBackProfit(bet.size, bet.price, bet.side === "BACK" ? 0 : 1)) + specialSuffix

                    return (
                      <tr
                        style={{
                          backgroundColor: bet.side === "BACK" ? "#A6D8FF" : "#FAC9D7"
                        }}
                      >
                        <td>
                          <img
                            className={"cancel-order-btn-2"}
                            src={`${window.location.origin}/icons/error.png`}
                            alt="X"
                            onClick={
                              // cancel order
                              props.onCancelOrder({
                                marketId: bet.marketId,
                                betId: bet.betId,
                                sizeReduction: null,
                                matchedBets: props.bets.matched,
                                unmatchedBets: props.bets.unmatched
                              })
                            }
                          />
                          {`${bet.size} @ ${bet.price} ${suffix}`}
                        </td>
                      </tr>
                    );
                  })

                )}
              </tbody>
            </table>
          </td>
          <td colSpan={1} rowSpan={4} style={{ verticalAlign: 'top', minHeight: '1.675em' }}>
            <button>0</button>
            <button onClick={props.onChangePriceType(props.priceType === "STAKE" ? "LIABILITY" : "STAKE")}>
              {props.priceType === "STAKE" ? "S" : "L"}
            </button>
            <button>K</button>
          </td>
          <td colSpan={3} rowSpan={4} style={{ verticalAlign: 'top' }}>
            <table className="lay-table">
              <tbody className={matchedBets.length > 0 ? "lay-body" : ""}>
                {matchedBets.map(bet => {
                  return (
                    <tr
                      style={{
                        backgroundColor: bet.side === "BACK" ? "#A6D8FF" : "#FAC9D7"
                      }}
                    >
                      <td>{`${bet.size} @ ${bet.price}`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </td>
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    priceType: state.market.priceType,
    market: state.market.currentMarket,
    bets: state.order.bets,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list,
    layList: state.lay.list,
    backList: state.back.list,
    fillOrKillList: state.fillOrKill.list,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePriceType: priceType => e => dispatch(changePriceType(priceType)),
    onCancelOrder: order => dispatch(cancelOrder(order))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);