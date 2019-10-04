import React from "react";
import { connect } from "react-redux";

const MatchedBets = props => {

  const reducer = (acc, cur) => acc.indexOf(cur.selectionId) === -1 ? acc.concat(cur.selectionId) : acc; 
  const selections = Object.values(props.bets.matched).reduce(reducer, [])

  return (
    <div>
      <table className="menu-bets">
        <tbody>
          <tr className="menu-bets-heading">
            <td>
              <button
                style={{
                  height: "22px",
                  width: "auto",
                  backgroundColor: "transparent",
                  visibility: "collapse",
                  pointerEvents: "none"
                }}
              />
            </td>
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
              const selectionObject = props.market.runners.find(runner => runner.selectionId === selection);
              if (selectionObject === undefined) return null;

              const filteredOrders = Object.values(props.bets.matched).filter(order => order.selectionId === selection);

              return (
            
                <React.Fragment>
                  <tr className="menu-bets-selection" colSpan={4}>
                    <td>{selectionObject.runnerName}</td>
                  </tr>
                  {
                    filteredOrders.map(order => 
                      <React.Fragment>
                          <tr
                          id="menu-unmatched-bet"
                          style={{
                            backgroundColor: order.side === "BACK" ? "#A6D8FF" : "#FAC9D7"
                          }}
                        >
                          <td>
                            <button style={{ height: "22px", width: "auto", visibility: 'collapse' }}>
                              
                            </button>
                          </td>

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
 
                      </React.Fragment>  
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
    bets: state.order.bets,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchedBets);
