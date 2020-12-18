import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
//* Actions
import { setStakeInOneClick } from '../../../actions/settings';
import { setCustomStake, setCustomStakeActive } from '../../../actions/market';
//* Utils
import { getOrderBtnBG, getOrderBtnBG2 } from '../../../utils/ColorManipulator';
//* JSS
import useStyles from '../../../jss/components/LadderView/priceRowStyle';

const PriceRow = ({
  selectionId, buttonType, stake, lay, stakeVal, setStakeInOneClick, customStake, customStakeActive, setCustomStake, setCustomStakeActive,
}) => {
  const classes = useStyles();
  const buttons = buttonType === 'STAKE' ? stake : lay;

  const castedPrices = useMemo(() => (Array.isArray(buttons) ? buttons : Object.values(buttons)), [buttons]);

  const handleStakeChanged = (price) => (e) => {
    setCustomStakeActive({ id: selectionId, customStakeActive: false });
    setStakeInOneClick({ selectionId, price: parseFloat(price) });
  };

  useEffect(() => {
    if (!stakeVal[selectionId]) setStakeInOneClick({ selectionId, price: 2 });
  }, []);

  return (
    <table className={classes.priceRow}>
      <tbody>
        <tr colSpan="8">
          <th
            key={`${selectionId}custom-price`}
            style={{ background: getOrderBtnBG2(buttonType, customStakeActive, -20) }}
            onClick={(e) => setCustomStakeActive({ id: selectionId, customStakeActive: true })}
          >
            <input type="text" value={customStake} onChange={(e) => setCustomStake({ id: selectionId, customStake: e.target.value })} />
          </th>
          {castedPrices.map((price) => (
            <th
              key={`${selectionId}${price}`}
              style={{ background: customStakeActive ? getOrderBtnBG(buttonType, parseFloat(price), undefined, -20) : getOrderBtnBG(buttonType, parseFloat(price), stakeVal[selectionId], -20) }}
              onClick={handleStakeChanged(price)}
            >
              {price}
            </th>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

const mapStateToProps = (state, props) => ({
  customStake: state.market.runners[props.selectionId].order.customStake,
  customStakeActive: state.market.runners[props.selectionId].order.customStakeActive,
  buttonType: state.market.priceType,
  stake: state.settings.stakeBtns,
  lay: state.settings.layBtns,
  stakeVal: state.settings.stake,
});

const mapDispatchToProps = { setStakeInOneClick, setCustomStake, setCustomStakeActive };

export default connect(mapStateToProps, mapDispatchToProps)(PriceRow);
