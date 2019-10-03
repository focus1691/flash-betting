import React, { useState } from "react";
import { connect } from "react-redux";
import { LightenDarkenColor } from "../../utils/ColorManipulator";

const PriceRow = ({ ltp, tv, priceType, stake, lay }) => {

  const [stakeVal, setStakeVal] = useState(null);

  const prices = priceType === "STAKE" ? stake : lay

  const castedPrices = Array.isArray(prices) ? prices : Object.values(prices)

  const getBG = (price) => {
    var bg = priceType === "STAKE" ? "#DBEFFF" : "#FEE9EE";
    return price === stakeVal ? LightenDarkenColor(bg, -20) : bg;
  }
  

  return (
    <tr className="price-row">
      <th colspan="8">
        {castedPrices.map(price => (
          <th style={{background: getBG(price)}} onClick={e => setStakeVal(price)}>{price}</th>
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