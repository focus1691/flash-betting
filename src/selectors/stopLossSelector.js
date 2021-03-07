import { createSelector } from 'reselect';
import { findStopPositionTicks, findStopPositionPercent } from '../utils/TradingStategy/StopLoss';

const getStopLossSelector = (stopLoss, { selectionId, price, side }) => ({
  stopLoss: stopLoss[selectionId],
  price,
  side,
});

export const getStopLoss = createSelector(getStopLossSelector, ({ stopLoss, price, side }) => {
  if (!stopLoss) return undefined;

  const actualPos = stopLoss.tickOffset > 0
    ? stopLoss.side === side
      ? stopLoss.units === 'Ticks'
        ? findStopPositionTicks(stopLoss.price, stopLoss.tickOffset, stopLoss.side)
        : findStopPositionPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side)
      : false
    : stopLoss.price;

  if (parseFloat(actualPos) === parseFloat(price) && stopLoss.side === side) {
    return { stopLoss, actualPos };
  }
  return undefined;
});
