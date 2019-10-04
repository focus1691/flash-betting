import React from "react";
import { connect } from "react-redux";
import { updateOrders } from "../../../actions/order";
import { combineUnmatchedOrders } from '../../../utils/combineUnmatchedOrders'

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
                                    order.PL === "0.00"
                                      ? "black"
                                      : order.PL > 0
                                      ? "green"
                                      : "red"
                                }}
                              >
                                {order.PL == "TODO PL" ? 0 : 0}
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
    onChangeOrders: orders => dispatch(updateOrders(orders))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnmatchedBets);
