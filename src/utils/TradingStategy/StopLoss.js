import { calcPercentDifference } from '../Bets/BettingCalculations';
import { ALL_PRICES } from '../ladder/CreateFullLadder';

export const checkStopLossHit = (size, matchedPrice, LTP, side, ticks, strategy) => {
  matchedPrice = Number(matchedPrice);
  LTP = Number(LTP);

  if (((side === 'BACK' && LTP <= matchedPrice) || (side === 'LAY' && LTP >= matchedPrice))) return { targetMet: false };
  if (strategy == 'ticks') return findStopPosition(matchedPrice, LTP, ticks, side);
  if (strategy == 'percent') return findStopPositionForPercent(size, matchedPrice, LTP, ticks, side);
  return findStopPosition(matchedPrice, LTP, ticks, side);
};

export const calcStopLossPrice = (matchedPrice, ticks, side) => {
  matchedPrice = parseFloat(matchedPrice);
  ticks = side == 'BACK' ? +ticks : -ticks;
  const stopAt = Math.floor(ALL_PRICES.indexOf(matchedPrice) + ticks);
  return parseFloat(ALL_PRICES[stopAt]).toFixed(2);
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

export const stopLossCheck = ({ units, size, price, side, ticks }, LTP) => {
  units = units || 'ticks';
  return checkStopLossHit(size, price, LTP, side, ticks, units);
};
