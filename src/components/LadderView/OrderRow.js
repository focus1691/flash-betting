import React from "react";
import { connect } from "react-redux";
import { changePriceType, updateOrder } from '../../actions/market';
import { cancelOrder, cancelOrderAction, updateOrders } from "../../actions/order";
import { combineUnmatchedOrders } from "../../utils/Bets/CombineUnmatchedOrders";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { calcBackProfit } from "../../utils/Bets/BettingCalculations";
import { updateStopLossList } from "../../actions/stopLoss";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateStopEntryList } from "../../actions/stopEntry";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
import { updateFillOrKillList } from "../../actions/fillOrKill";

const OrderRow = props => {

  const cancelUnmatchedOrder = order => {
    let ordersToRemove = [];
    // figure out which strategy it's using and make a new array without it
    switch (order.strategy) {
      case "Back":
        const newBackList = Object.assign({}, props.backList);
        newBackList[order.selectionId] = newBackList[order.selectionId].filter(item => item.rfs !== order.rfs)
        props.onChangeBackList(newBackList);
        break;
      case "Lay":
        const newLayList = Object.assign({}, props.layList);
        newLayList[order.selectionId] = newLayList[order.selectionId].filter(item => item.rfs !== order.rfs)
        props.onChangeLayList(newLayList);
        break;
      case "Stop Entry":
        const newStopEntryList = Object.assign({}, props.stopEntryList);
        newStopEntryList[order.selectionId] = newStopEntryList[order.selectionId].filter(item => item.rfs !== order.rfs)
        props.onChangeStopEntryList(newStopEntryList);
        break;
      case "Tick Offset":
        const newTickOffsetList = Object.assign({}, props.tickOffsetList);
        delete newTickOffsetList[order.rfs]
        props.onChangeTickOffsetList(newTickOffsetList)
        break;
      case "Stop Loss":
        const newStopLossList = Object.assign({}, props.stopLossList);
        delete newStopLossList[order.selectionId];
        props.onChangeStopLossList(newStopLossList)
        break;
      case "None":
        // if we can find something that fits with the fill or kill, we can remove that too (this is because we don't make another row for fill or kill)
        if (props.fillOrKillList[order.betId] !== undefined) {
          const newFillOrKill = Object.assign({}, props.fillOrKillList)
          ordersToRemove = ordersToRemove.concat(newFillOrKill[order.betId])
          delete newFillOrKill[order.betId];
          props.onChangeFillOrKillList(newFillOrKill)
  
        }
  
        // cancel order
        props.onCancelOrder({
          marketId: order.marketId,
          betId: order.betId,
          sizeReduction: null,
          matchedBets: props.bets.matched,
          unmatchedBets: props.bets.unmatched
        });
  
        break;
      default:
        break;
    }
  
    ordersToRemove = ordersToRemove.concat(order);
  
    // delete from database
    try {
      fetch('/api/remove-orders', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ordersToRemove)
      })
    } catch (e) {
  
    }
  };

  const cancelAllOrdersOnSelection = async (marketId, selectionId, unmatchedBets, matchedBets) => {
    const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);

    if (currentOrders) {
      // filter all the ones out that arent in the same selection or arent unmatched
      const openSelectedRunnerOrders = currentOrders.filter(order => order.selectionId === parseInt(selectionId) && (order.status === "EXECUTABLE" || order.status === "PENDING"))

      // this is basically calling 1 bet after another and returning the unmatched bets it gets from it
      const cancelBets = await openSelectedRunnerOrders.reduce(async (previousPromise, nextOrder) => {
        const previousCancelOrderUnmatchedBets = await previousPromise;
        return cancelOrderAction({
          marketId: nextOrder.marketId,
          betId: nextOrder.betId,
          sizeReduction: null,
          matchedBets: matchedBets,
          unmatchedBets: previousCancelOrderUnmatchedBets && previousCancelOrderUnmatchedBets.unmatched ? previousCancelOrderUnmatchedBets.unmatched : unmatchedBets,
        });
      }, Promise.resolve());

      props.onUpdateBets({
        unmatched: cancelBets.unmatched,
        matched: cancelBets.matched
      })
    }
  }

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
                              "") + specialSuffix

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
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                              cancelUnmatchedOrder(bet)
                            }}
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
            <button onClick={() => cancelAllOrdersOnSelection(props.market.marketId, props.selectionId, props.bets.unmatched, props.bets.matched)}>
              K
            </button>
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
    onCancelOrder: order => dispatch(cancelOrder(order)),
    onChangeOrders: orders => dispatch(updateOrder(orders)),
    onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
    onChangeLayList: list => dispatch(updateLayList(list)),
    onChangeBackList: list => dispatch(updateBackList(list)),
    onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
    onUpdateBets: bets => dispatch(updateOrders(bets)), // this is for the bets
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);

