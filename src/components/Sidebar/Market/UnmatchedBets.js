import React from "react";
import { connect } from "react-redux";
import { updateOrders } from "../../../actions/order";
import { combineUnmatchedOrders } from '../../../utils/combineUnmatchedOrders'
import { calcBackProfit } from "../../../utils/PriceCalculator";
import { updateStopLossList } from "../../../actions/stopLoss";
import { updateTickOffsetList } from "../../../actions/tickOffset";
import { updateStopEntryList } from "../../../actions/stopEntry";
import { updateLayList } from "../../../actions/lay";
import { updateBackList } from "../../../actions/back";
import { updateFillOrKillList } from "../../../actions/fillOrKill";
import { formatPrice } from "../../../utils/ladder/CreateFullLadder";

const UnmatchedBets = props => {
  
  const allOrders = combineUnmatchedOrders(props.backList, props.layList, props.stopEntryList, props.tickOffsetList, props.stopLossList, props.bets.unmatched)
  const selections = Object.keys(allOrders)  


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
                          
                          //const marketStart new Date(props.market.marketStartTime).valueOf() / 1000
                          const remainingTime = (new Date(props.market.marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000) 
                          const remainingMinutes = Math.floor((remainingTime - order.timeOffset) / 60)
                          const remainingSeconds = Math.floor((remainingTime - order.timeOffset) % 60)
                          console.log(remainingSeconds)
                          
                          let suffix = "";
                          if (order.trailing && order.hedged) suffix = "th"
                          else if (!order.trailing && order.hedged) suffix = "h"
                          else if (order.trailing && !order.hedged) suffix = "t"

                          const PL = 
                            (order.strategy == "Stop Loss" ? "SL " :
                            order.strategy == "Tick Offset" ? "T.O." :
                            order.strategy == "Back" || order.strategy == "Lay" ? remainingMinutes + ":" + remainingSeconds + 's' + (order.executionTime == "Before" ? "-" : "+")  :
                            order.strategy == "Stop Entry" ? order.stopEntryCondition + formatPrice(order.targetLTP) + "SE" :
                            calcBackProfit(order.size, order.price, order.side === "BACK" ? 0 : 1)) + suffix

                          return (
                            <tr
                              id="menu-unmatched-bet"
                              style={{
                                backgroundColor: order.side === "BACK" ? "#A6D8FF" : "#FAC9D7"
                              }}
                            >
                            
                              <button 
                                style={{ height: "22px", width: "auto" }} 
                                onClick={() => {
                                  // figure out which strategy it's using and make a new array without it
                                  switch(order.strategy) {
                                    case "Back":
                                      
                                      break;
                                    case "Lay":
                                      
                                      break;
                                    case "Stop Entry":
                                      
                                      break;
                                    case "Tick Offset":
                                      
                                      break;
                                    case "Fill Or Kill":
                                      
                                      
                                      break;
                                    case "Stop Loss":
                                      
                                      break;
                                    case "None":
                                      
                                      break;
                                    default:
                                      break;
                                  }

                                }}
                              >
                                {/* <img src = {require('./CancelIcon.svg')} alt="" style = {{height: "100%", width: "auto"}} /> In Progress */}
                              </button>
                              <td>{order.price}</td>
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
                          )
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
    bets: state.order.bets
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchedBets);
