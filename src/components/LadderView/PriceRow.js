import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getOrderBtnBG } from "../../utils/ColorManipulator";
import { setStakeInOneClick } from "../../actions/settings";

const PriceRow = ({ selectionId, ltp, tv, buttonType, stake, lay, stakeVal, onSetStake }) => {

  const buttons = buttonType === "STAKE" ? stake : lay;

  const castedPrices = Array.isArray(buttons) ? buttons : Object.values(buttons);

  const handleStakeChanged = price => e => {
    onSetStake({selectionId, price: parseFloat(price)});
  };

  useEffect(() => {
    if (stakeVal[selectionId] === undefined) {
      onSetStake({selectionId, price: 2});
    }
  }, []);
  
  return (
    <div className="price-row">
      <div colspan="8">
        {castedPrices.map(price => (
          <th
            style={{background: getOrderBtnBG(buttonType, parseFloat(price), stakeVal[selectionId], -20)}}
            onClick={handleStakeChanged(price)}>{price}
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
    lay: state.settings.layBtns,
    stakeVal: state.settings.stake
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetStake: stake => dispatch(setStakeInOneClick(stake))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceRow); 