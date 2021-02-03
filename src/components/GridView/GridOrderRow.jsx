import React from 'react';
import { connect } from 'react-redux';
import crypto from 'crypto';
//* @material-ui core
import Divider from '@material-ui/core/Divider';
//* Actions
import { placeOrder } from '../../actions/bet';
//* JSS
import useStyles from '../../jss/components/GridView/GridOrderRow';
//* Utils
import { LightenDarkenColor } from '../../utils/ColorManipulator';

const GridOrderRow = ({ marketId, runnerId, order, toggleStakeAndLiabilityButtons, toggleBackAndLay, stakeBtns, layBtns, backLay, stakeLiability, updateOrderSize, updateOrderPrice, toggleOrderRowVisibility, placeOrder, bets, price, side, size }) => {
  const classes = useStyles();

  const executeOrder = () => {
    const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);
    placeOrder({
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
            <img className={classes.switch} style={{ transform: `scaleX(${stakeLiability === 0 ? 1 : -1})`}} src={`${window.location.origin}/icons/red_switch.png`} alt="Toggle" />
            {stakeLiability === 0 ? 'STAKE' : 'Liability'}
          </li>

          {(stakeLiability === 0 ? stakeBtns : layBtns).map((size, index) => (
            <li
              key={`grid-order-${index}`}
              style={{ background: size === order.stake ? LightenDarkenColor(stakeLiability === 0 ? '#007aaf' : '#d4696b', -20) : '' }}
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
            {backLay === 0 ? 'BACK' : 'LAY'}
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

          <button type="button" onClick={executeOrder}>
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

const mapStateToProps = (state) => ({
  marketId: state.market.marketId,
  stakeBtns: state.settings.stakeBtns,
  layBtns: state.settings.layBtns,
});

const mapDispatchToProps = { placeOrder };

export default connect(mapStateToProps, mapDispatchToProps)(GridOrderRow);
