import React from "react";
import { connect } from "react-redux";

const PriceRow = ({ ltp, tv, priceType }) => {

  const prices = priceType === "STAKE" ? [2, 4, 6, 8, 10, 12, 14, 16] : [5, 7.50, 10, 12.50, 15, 17.50, 20, 22.5]

  return (
    <tr className="price-row">
      {prices.map(price => (
        <th>{price}</th>
      ))}
    </tr>
  );
};

const mapStateToProps = state => {
  return {
    priceType: state.market.priceType
  };
};

export default connect(mapStateToProps, )(PriceRow); 