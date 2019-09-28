import React from "react";
import { connect } from "react-redux";

const PriceRow = ({ ltp, tv, priceType, stake, lay }) => {

  const prices = priceType === "STAKE" ? stake : lay

  const castedPrices = Array.isArray(prices) ? prices : Object.values(prices)
  

  return (
    <tr className="price-row">
      <th colspan="8">
        {castedPrices.map(price => (
          <th>{price}</th>
        ))}
      </th>
    </tr>
  );
};

const mapStateToProps = state => {
  return {
    priceType: state.market.priceType,
    stake: state.settings.stakeBtns,
    lay: state.settings.layBtns
  };
};

export default connect(mapStateToProps, )(PriceRow); 