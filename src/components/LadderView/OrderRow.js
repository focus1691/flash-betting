import React from "react";
import { connect } from "react-redux";
import { changePriceType } from '../../actions/market'

const OrderRow = props => {

  const matchedBets = Object.values(props.bets.matched).filter(order => parseFloat(order.selectionId) === parseFloat(props.selectionId));
  const unMatchedBets = Object.values(props.bets.unmatched).filter(order => parseFloat(order.selectionId) === parseFloat(props.selectionId));

  return (
    <div className={"order-row"}>
      <table>
        <tbody>
          <td colSpan={3} rowSpan={4} style={{verticalAlign: 'top'}}>
            <table className="lay-table">
              <tbody className={unMatchedBets.length > 0 ? "lay-body" : ""}>
                {unMatchedBets.map(bet => {
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
          <td colSpan={1} rowSpan={4} style={{verticalAlign: 'top'}}>
            <button>0</button>
            <button onClick={() => {
              props.onChangePriceType(props.priceType === "STAKE" ? "LIABILITY" : "STAKE")
            }}>
              {props.priceType === "STAKE" ? "S" : "L"}
            </button>
            <button>K</button>
          </td>
          <td colSpan={3} rowSpan={4} style={{verticalAlign: 'top'}}>
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
    bets: state.order.bets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePriceType: priceType => dispatch(changePriceType(priceType))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);