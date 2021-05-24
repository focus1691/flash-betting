import React from 'react';
import uuid from 'react-uuid';
import { connect } from 'react-redux';
import clsx from 'clsx';
//* Actions
import { setStake } from '../../../actions/settings';
import { setCustomStake } from '../../../actions/market';
//* JSS
import useStyles from '../../../jss/components/LadderView/priceRowStyle';

const PriceRow = ({ selectionId, buttonType, stake, lay, stakeVal, setStake, customStake, setCustomStake }) => {
  const classes = useStyles();
  const buttons = buttonType === 'STAKE' ? stake : lay;

  const handleStakeChanged = (price) => () => {
    setStake({ selectionId, price: parseFloat(price) });
  };

  return (
    <table className={classes.priceRow}>
      <tbody>
        <tr colSpan="8">
          <th key={`${selectionId}custom-price`}>
            <input type="text" value={customStake} onChange={(e) => setCustomStake({ id: selectionId, customStake: e.target.value })} />
          </th>
          {buttons.map((price) => (
            <th
              key={`ladder-price-${selectionId}-${uuid()}`}
              onClick={handleStakeChanged(price)}
              className={clsx({
                [classes.priceSelected]: stakeVal[selectionId] == price,
              })}
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
  buttonType: state.market.priceType,
  stake: state.settings.stakeBtns,
  lay: state.settings.layBtns,
  stakeVal: state.settings.stake,
});

const mapDispatchToProps = { setStake, setCustomStake };

export default connect(mapStateToProps, mapDispatchToProps)(PriceRow);
