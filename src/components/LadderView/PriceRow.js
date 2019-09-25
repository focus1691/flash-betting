import React from "react";
import { connect } from "react-redux";

const PriceRow = ({ ltp, tv, priceType }) => {

  const prices = priceType === "STAKE" ? [2, 4, 6, 8, 10, 12, 14] : [5, 7.50, 10, 12.50, 15, 17.50, 20]

  return (
    <tfoot className="price-row">
      {prices.map(price => (
        <td>{price}</td>
      ))}
    </tfoot>
  );
};

const mapStateToProps = state => {
  return {
    priceType: state.market.priceType
  };
};

export default connect(mapStateToProps, )(PriceRow); 