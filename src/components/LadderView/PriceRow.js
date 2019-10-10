import React, { useState } from "react";
import { connect } from "react-redux";
import { getOrderBtnBG } from "../../utils/ColorManipulator";

const PriceRow = ({ ltp, tv, buttonType, stake, lay }) => {

  const [stakeVal, setStakeVal] = useState(null);

  const buttons = buttonType === "STAKE" ? stake : lay;

  const castedPrices = Array.isArray(buttons) ? buttons : Object.values(buttons)  

  return (
    <div className="price-row">
      <div colspan="8">
        {castedPrices.map(price => (
          <th
            style={{background: getOrderBtnBG(buttonType, price, stakeVal, -20)}}
            onClick={e => setStakeVal(price)}>{price}
          </th>
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    buttonType: state.market.priceType,
    stake: state.settings.stakeBtns,
    lay: state.settings.layBtns
  };
};

export default connect(mapStateToProps)(PriceRow); 