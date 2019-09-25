import React from "react";
import { connect } from "react-redux";
import { changePriceType } from '../../actions/market'

const OrderRow = ({priceType, onChangePriceType}) => (
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
          <button onClick={() => {
            onChangePriceType(priceType === "STAKE" ? "LIABILITY" : "STAKE")
          }}>
            {priceType === "STAKE" ? "S" : "L"}
          </button>
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

const mapStateToProps = state => {
  return {
    priceType: state.market.priceType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangePriceType: priceType => dispatch(changePriceType(priceType))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);