import React from "react";
import { connect } from "react-redux";

const MatchedBets = props => {
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
              6f Class Stks Windsor Event name here
            </td>
          </tr>
          {props.marketOpen
            ? props.bets.matched.map(orders => (
                <>
                  <tr className="menu-bets-selection" colSpan={4}>
                    <td>{props.selection}</td>
                  </tr>
                  {orders.map(bet => (
                    <>
                      <tr
                        id="menu-unmatched-bet"
                        style={{
                          backgroundColor: bet.isBack ? "#A6D8FF" : "#FAC9D7"
                        }}
                      >
                        <button style={{ height: "22px", width: "auto" }}>
                          {/* <img src = {require('./CancelIcon.svg')} alt="" style = {{height: "100%", width: "auto"}} /> In Progress */}
                        </button>

                        <td>{bet.odds}</td>
                        <td>{bet.stake}</td>
                        <td
                          id="pl-style"
                          style={{
                            color:
                              bet.PL === "0.00"
                                ? "black"
                                : bet.PL > 0
                                ? "green"
                                : "red"
                          }}
                        >
                          {bet.PL}
                        </td>
                      </tr>
                    </>
                  ))}
                </>
              ))
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
    bets: state.order.bets
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchedBets);
