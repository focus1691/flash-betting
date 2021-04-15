import React, { useEffect, useMemo } from 'react';
import uuid from 'react-uuid';
import { connect } from 'react-redux';
//* Actions
import { setStake } from '../../../actions/settings';
import { setCustomStake, setCustomStakeActive } from '../../../actions/market';
//* Utils
import { getStakeButtonStyle, getCustomStakeStyle } from '../../../utils/ColorManipulator';
//* JSS
import useStyles from '../../../jss/components/LadderView/priceRowStyle';

const PriceRow = ({
  selectionId, buttonType, stake, lay, stakeVal, setStake, customStake, customStakeActive, setCustomStake, setCustomStakeActive,
}) => {
  const classes = useStyles();
  const buttons = buttonType === 'STAKE' ? stake : lay;

  const castedPrices = useMemo(() => (Array.isArray(buttons) ? buttons : Object.values(buttons)), [buttons]);

  const handleStakeChanged = (price) => () => {
    setCustomStakeActive({ id: selectionId, customStakeActive: false });
    setStake({ selectionId, price: parseFloat(price) });
  };

  useEffect(() => {
    if (!stakeVal[selectionId]) setStake({ selectionId, price: 2 });
  }, []);

  return (
    <table className={classes.priceRow}>
      <tbody>
        <tr colSpan="8">
          <th
            key={`${selectionId}custom-price`}
            style={{ background: getCustomStakeStyle(buttonType, customStakeActive, -20) }}
            onClick={() => setCustomStakeActive({ id: selectionId, customStakeActive: true })}
          >
            <input type="text" value={customStake} onChange={(e) => setCustomStake({ id: selectionId, customStake: e.target.value })} />
          </th>
          {castedPrices.map((price) => (
            <th
              key={`ladder-price-${selectionId}-${uuid()}`}
              style={{ background: customStakeActive ? getStakeButtonStyle(buttonType, parseFloat(price), undefined, -20) : getStakeButtonStyle(buttonType, parseFloat(price), stakeVal[selectionId], -20) }}
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

const mapDispatchToProps = { setStake, setCustomStake, setCustomStakeActive };

export default connect(mapStateToProps, mapDispatchToProps)(PriceRow);
