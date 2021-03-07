/* eslint-disable no-use-before-define */
import { calcPercentDifference } from '../Bets/BettingCalculations';
import { ALL_PRICES } from '../ladder/CreateFullLadder';

export const calcStopLossPrice = (price, ticks, side) => {
  price = Number(price);
  ticks = side == 'BACK' ? +ticks : -ticks; // Add for back, subtract for lay
  let indexToStop = ALL_PRICES.indexOf(price) + ticks; // Price index
  indexToStop = Math.min(Math.max(0, indexToStop), ALL_PRICES.length - 1); // Must be between 1.01 - 1000
  return ALL_PRICES[indexToStop];
};

export const checkStopLossHit = ({ units, size, price, side, ticks }, LTP) => {
  price = Number(price);
  LTP = Number(LTP);
  units = units || 'ticks';

  if (((side === 'BACK' && LTP <= price) || (side === 'LAY' && LTP >= price))) return { targetMet: false };
  if (units == 'ticks') return findStopPosition(price, LTP, ticks, side);
  if (units == 'percent') return findStopPositionForPercent(size, price, LTP, ticks, side);
  return findStopPosition(price, LTP, ticks, side);
};

export const findStopPosition = (matchedPrice, LTP, ticks, side) => {
  matchedPrice = parseFloat(matchedPrice);
  LTP = parseFloat(LTP);
  ticks = side == 'BACK' ? +ticks : -ticks;

  const stopAt = Math.floor(ALL_PRICES.indexOf(matchedPrice) + ticks);
  const ltpIndex = Math.floor(ALL_PRICES.indexOf(LTP));

  return {
    targetMet: (side == 'BACK' && ltpIndex >= stopAt) || (side == 'LAY' && ltpIndex <= stopAt),
    stopPrice: parseFloat(ALL_PRICES[stopAt]).toFixed(2),
  };
};

export const findStopPositionForPercent = (size, matchedPrice, LTP, percent, side) => {
  matchedPrice = parseFloat(matchedPrice);

  if (side == 'BACK') {
    const percentIncrease = calcPercentDifference(size, matchedPrice, LTP);
    const percentOfPrice = matchedPrice + (matchedPrice * percent) / 100;
    return {
      targetMet: percentIncrease >= percent && LTP >= matchedPrice,
      stopPrice: ALL_PRICES.reduce((prev, curr) => (Math.abs(curr - percentOfPrice) < Math.abs(prev - percentOfPrice) ? curr : prev)),
    };
  }
  if (side == 'LAY') {
    const percentIncrease = calcPercentDifference(size, matchedPrice, LTP);
    const percentOfPrice = matchedPrice - (matchedPrice * percent) / 100;
    return {
      targetMet: percentIncrease >= percent && LTP <= matchedPrice,
      stopPrice: ALL_PRICES.reduce((prev, curr) => (Math.abs(curr - percentOfPrice) < Math.abs(prev - percentOfPrice) ? curr : prev)),
    };
  }
};

export const checkStopLossTrigger = (SL, rfs, sizeRemaining) => SL && !SL.assignedIsOrderMatched && SL.rfs == rfs && sizeRemaining == 0;
