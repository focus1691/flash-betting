import crypto from 'crypto';
import React from 'react';
import { LightenDarkenColor } from '../../utils/ColorManipulator';
//* @material-ui core
import Divider from '@material-ui/core/Divider';
//* JSS
import useStyles from '../../jss/components/GridView/GridOrderRow';

export default ({ marketId, runnerId, order, orderProps, toggleStakeAndLiabilityButtons, toggleBackAndLay, updateOrderSize, updateOrderPrice, toggleOrderRowVisibility, onPlaceOrder, bets, price, side, size }) => {
  const classes = useStyles();
  const executeOrder = () => () => {
    const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
    onPlaceOrder({
      marketId,
      side,
      size,
      price,
      selectionId: runnerId,
      customerStrategyRef: referenceStrategyId,
      unmatchedBets: bets.unmatched,
      matchedBets: bets.matched,
    });
  };

  return order.visible ? (
    <tr className={classes.gridOrderRow}>
      <td colSpan={11}>
        <ul className={classes.gridOrderRow}>
          <li onClick={toggleStakeAndLiabilityButtons({ id: runnerId })}>
            {/* <img src={`${window.location.origin}/icons/change.png`} alt="Toggle" /> */}
            {orderProps.text}
          </li>

          {orderProps.prices.map((size, index) => (
            <li
              key={`grid-order-${index}`}
              style={{ background: size === order.stake ? LightenDarkenColor(orderProps.bg, -20) : '' }}
              onClick={updateOrderSize({
                id: runnerId,
                backLay: order.backLay,
                stake: size,
              })}
            >
              {size}
            </li>
          ))}
          <Divider orientation="vertical" />
          <span
            className={classes.toggleBackLay}
            onClick={toggleBackAndLay({
              id: runnerId,
              backLay: order.backLay ^ 1,
            })}
          >
            {orderProps.text2}
          </span>

          <input
            type="text"
            name="stake"
            value={order.stake}
            onChange={updateOrderSize({
              id: runnerId,
              backLay: order.backLay,
            })}
          />
          <span>@</span>
          <input
            type="number"
            name="price"
            min="1"
            max="1000"
            value={order.price}
            onChange={updateOrderPrice({
              id: runnerId,
              price: order.price,
            })}
          />

          <button type="button" onClick={executeOrder()}>
            Submit
          </button>

          <span className={classes.gridImgContainer}>
            <a href="#" onClick={() => false}>
              <img
                src={`${window.location.origin}/icons/X_Button.svg`}
                alt="Close"
                onClick={toggleOrderRowVisibility({
                  id: runnerId,
                  visible: false,
                })}
              />
            </a>
          </span>
        </ul>
      </td>
    </tr>
  ) : null;
};
