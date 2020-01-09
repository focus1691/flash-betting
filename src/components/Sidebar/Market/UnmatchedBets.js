import React from "react";
import { connect } from "react-redux";
import { updateBackList } from "../../../actions/back";
import { updateFillOrKillList } from "../../../actions/fillOrKill";
import { updateLayList } from "../../../actions/lay";
import { cancelOrder, updateOrders } from "../../../actions/order";
import { updateStopEntryList } from "../../../actions/stopEntry";
import { updateStopLossList } from "../../../actions/stopLoss";
import { updateTickOffsetList } from "../../../actions/tickOffset";
import { calcBackProfit, twoDecimalPlaces } from "../../../utils/Bets/BettingCalculations";
import { combineUnmatchedOrders } from '../../../utils/Bets/CombineUnmatchedOrders';
import { formatPrice, getPriceNTicksAway } from "../../../utils/ladder/CreateFullLadder";
import { getTimeToDisplay } from '../../../utils/TradingStategy/BackLay'

const UnmatchedBets = props => {

  const allOrders = combineUnmatchedOrders(props.backList, props.layList, props.stopEntryList, props.tickOffsetList, props.stopLossList, props.bets.unmatched);
  const selections = Object.keys(allOrders);

  const cancelOrder = order => e => {
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

  const replaceOrderPrice = (order, newPrice) => {
    const newOrder = Object.assign({}, order, {price: newPrice})
    switch (order.strategy) {
      case "Back":
        const newBackList = Object.assign({}, props.backList);
        const indexBack = newBackList[order.selectionId].findIndex(item => item.rfs === order.rfs)
        newBackList[order.selectionId][indexBack].price = newPrice;
        props.onChangeBackList(newBackList);
        break;
      case "Lay":
        const newLayList = Object.assign({}, props.layList);
        const indexLay = newLayList[order.selectionId].findIndex(item => item.rfs === order.rfs)
        newLayList[order.selectionId][indexLay].price = newPrice;
        props.onChangeLayList(newLayList);
        break;
      case "Stop Entry":
        const newStopEntryList = Object.assign({}, props.stopEntryList);
        const indexStopEntry = newStopEntryList[order.selectionId].findIndex(item => item.rfs === order.rfs)
        newStopEntryList[order.selectionId][indexStopEntry].price = newPrice;
        props.onChangeStopEntryList(newStopEntryList);
        break;
      case "Tick Offset":
        const newTickOffsetList = Object.assign({}, props.tickOffsetList);
        newTickOffsetList[order.rfs].price = newPrice;
        props.onChangeTickOffsetList(newTickOffsetList)
        break;
      case "Stop Loss":
        const newStopLossList = Object.assign({}, props.stopLossList);
        newStopLossList[order.selectionId].price = newPrice;
        props.onChangeStopLossList(newStopLossList)
        break;
      case "None":
        // if we can find something that fits with the fill or kill, we can remove that too (this is because we don't make another row for fill or kill)
        if (props.fillOrKillList[order.betId] !== undefined) {
          const newFillOrKill = Object.assign({}, props.fillOrKillList)
          newFillOrKill[order.betId].price = newPrice;
          props.onChangeFillOrKillList(newFillOrKill)

        }

        fetch('/api/replace-orders', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify({
            marketId: order.marketId,
            betId: order.betId,
            newPrice: newPrice,
            customerRef: order.rfs
          })
        })
        .then(res => res.json())
        .then(res => {
          if (res.status === "SUCCESS") {
            const newUnmatched = Object.assign({}, props.bets.unmatched);
            
            const newBetId = res.instructionReports[0].placeInstructionReport.betId;
            newUnmatched[newBetId] = Object.assign({}, newUnmatched[order.betId]);
            newUnmatched[newBetId].price = res.instructionReports[0].placeInstructionReport.instruction.limitOrder.price;
            newUnmatched[newBetId].betId = newBetId;

            delete newUnmatched[order.betId];

            props.onChangeOrders({
              unmatched: newUnmatched,
              matched: props.bets.matched,
            })
          }
        })
        

        break;
      default:
        break;
    }

    try {
      fetch('/api/update-order', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(newOrder)
      })
    } catch (e) {

    }

  }

  const handleRightClick = order => {
    replaceOrderPrice(order, getPriceNTicksAway(parseFloat(order.price), props.rightClickTicks))
  }

  return (
    <div>
      <table className="menu-bets">
        <tbody>
          <tr className="menu-bets-heading">
            <button
              style={{
                height: "22px",
                width: "auto",
                backgroundColor: "transparent",
                visibility: "collapse",
                pointerEvents: "none"
              }}
            />
            <td>Odds</td>
            <td>Stake</td>
            <td>P/L</td>
          </tr>
          <tr>
            <td className="menu-bets-event" colSpan={4}>
              {props.market.competition !== undefined ? props.market.marketName + " " + props.market.competition.name : null}
            </td>
          </tr>
          {props.marketOpen
            ? selections.map(selection => {

              const selectionObject = props.market.runners.find(runner => runner.selectionId == selection);
              if (selectionObject === undefined) return null;

              return (
                <React.Fragment>
                  <tr className="menu-bets-selection" colSpan={4}>
                    <td>{selectionObject.runnerName}</td>
                  </tr>
                  {
                    Object.values(allOrders[selection]).map(rfs =>
                      rfs.map(order => {
                        

                        let suffix = "";
                        if (order.trailing && order.hedged) suffix = "th"
                        else if (!order.trailing && order.hedged) suffix = "h"
                        else if (order.trailing && !order.hedged) suffix = "t"

                        const PL =
                          (order.strategy === "Stop Loss" ? "SL " :
                            order.strategy === "Tick Offset" ? "T.O." :
                              order.strategy === "Back" || order.strategy === "Lay" ? getTimeToDisplay(order, props.market.marketStartTime) + 's' + (order.executionTime === "Before" ? "-" : "+") :
                                order.strategy === "Stop Entry" ? order.stopEntryCondition + formatPrice(order.targetLTP) + "SE" :
                                  calcBackProfit(order.size, order.price, order.side === "BACK" ? 0 : 1)) + suffix

                        return (
                          <tr
                            id="menu-unmatched-bet"
                            style={{
                              backgroundColor: order.side === "BACK" ? "#A6D8FF" : "#FAC9D7",
                              cursor: 'pointer',
                            }}
                            onContextMenu = {e => {
                              e.preventDefault()
                              handleRightClick(order)
                            }}
                          >

                            <button
                              className={"cancel-order-btn"}
                              style={{ height: "22px", width: "auto" }}
                              onClick={cancelOrder(order)}
                            >
                              <img src={`${window.location.origin}/icons/error.png`} alt="X"/>
                            </button>
                            <td>{twoDecimalPlaces(order.price)}</td>
                            <td>{order.size}</td>
                            <td
                              id="pl-style"
                              style={{
                                color:
                                  PL === "0.00"
                                    ? "black"
                                    : PL > 0
                                      ? "green"
                                      : "red"
                              }}
                            >
                              {PL}
                            </td>
                          </tr>
                        );
                      })
                    )
                  }
                </React.Fragment>
              )
            })
            : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list,
    layList: state.lay.list,
    backList: state.back.list,
    fillOrKillList: state.fillOrKill.list,
    bets: state.order.bets,
    rightClickTicks: state.settings.rightClickTicks
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeOrders: orders => dispatch(updateOrders(orders)),
    onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
    onChangeLayList: list => dispatch(updateLayList(list)),
    onChangeBackList: list => dispatch(updateBackList(list)),
    onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
    onCancelOrder: order => dispatch(cancelOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchedBets);
