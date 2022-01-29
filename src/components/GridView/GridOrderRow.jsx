import React, { useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import crypto from 'crypto';
//* @material-ui core
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
//* Actions
import { placeOrder } from '../../redux/actions/bet';
//* JSS
import useStyles from '../../jss/components/GridView/GridOrderRow';
//* Utils
import { formatPrice, isValidPrice } from '../../utils/Bets/PriceCalculations';
import { isNumeric } from '../../utils/validator';
import { LightenDarkenColor } from '../../utils/ColorManipulator';

const GridOrderRow = ({ marketId, selectionId, order, toggleStakeAndLiabilityButtons, toggleBackAndLay, stakeBtns, layBtns, stakeLiability, updateOrderSize, updateOrderPrice, toggleOrderRowVisibility, placeOrder, price, side, size }) => {
  const classes = useStyles();
  const [validStake, setValidStake] = useState(true);
  const [validPrice, setValidPrice] = useState(true);

  const executeOrder = () => {
    setValidPrice(isValidPrice(price));
    setValidStake(isNumeric(size));

    if (validPrice && validStake) {
      const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
      placeOrder({
        marketId,
        selectionId,
        side,
        size,
        price: formatPrice(price),
        customerStrategyRef,
      });
    }
  };

  return order.visible ? (
    <tr className={classes.gridOrderRow}>
      <td colSpan={11}>
        <ul className={classes.gridOrderRow}>
          <li onClick={toggleStakeAndLiabilityButtons({ id: selectionId })}>
            <img
              className={clsx({
                [classes.switch]: true,
                [classes.switchStake]: stakeLiability === 0,
                [classes.switchLiability]: stakeLiability === 1,
              })}
              style={{ transform: `scaleX(${stakeLiability === 0 ? 1 : -1})` }}
              src={`${window.location.origin}/icons/red_switch.png`}
              alt="Toggle"
            />
            {stakeLiability === 0 ? 'STAKE' : 'Liability'}
          </li>

          {(stakeLiability === 0 ? stakeBtns : layBtns).map((size, index) => (
            <li
              key={`grid-order-${index}`}
              className={clsx({
                [classes.stakeButton]: stakeLiability === 0,
                [classes.liabilityButton]: stakeLiability === 1,
              })}
              style={{ background: size === order.stake ? LightenDarkenColor(stakeLiability === 0 ? '#007aaf' : '#d4696b', -20) : '' }}
              onClick={updateOrderSize({
                id: selectionId,
                side,
                stake: size,
              })}
            >
              {size}
            </li>
          ))}
          <span className={classes.toggleBackLay} onClick={toggleBackAndLay(selectionId, side)}>
            {side}
          </span>

          <input
            className={clsx({
              [classes.invalidInput]: !validStake
            })}
            type="text"
            name="stake"
            value={order.stake}
            onChange={updateOrderSize({
              id: selectionId,
              side,
            })}
          />
          <span>@</span>

          <input
            className={clsx({
              [classes.invalidInput]: !validPrice
            })}
            type="number"
            name="price"
            min="1"
            max="1000"
            value={order.price}
            onChange={updateOrderPrice({
              id: selectionId,
              price: order.price,
            })}
          />

          <Button className={classes.submitBtn} onClick={executeOrder}>
            Submit
          </Button>

          <IconButton
            aria-label="close"
            className={classes.gridImgContainer}
            onClick={toggleOrderRowVisibility({
              id: selectionId,
              visible: false,
            })}
          >
            <img src={`${window.location.origin}/icons/X_Button.svg`} alt="" />
          </IconButton>
        </ul>
      </td>
    </tr>
  ) : null;
};

const mapStateToProps = (state) => ({
  marketId: state.market.marketId,
  stakeBtns: state.settings.stakeBtns,
  layBtns: state.settings.layBtns,
});

const mapDispatchToProps = { placeOrder };

export default connect(mapStateToProps, mapDispatchToProps)(GridOrderRow);
