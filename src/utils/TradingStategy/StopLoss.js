import { calcPercentDifference } from '../Bets/BettingCalculations';
import { ALL_PRICES } from '../ladder/CreateFullLadder';

/**
 * This function is used to calculate whether the stop loss has been triggered.
 * @param {number} size - The position of the bet e.g. £10
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} LTP - The current price the bet is trading at e.g. 3.15
 * @param {string} side - Back or Lay *REQUIRED*
 * @param {number} ticks - Number of ticks for the stop, or percentage of price
 * @param {string} strategy - ticks field represents percent if percent is passed
 * @return {Object} {targetMet, stopPrice or stopPrice}
 */
const checkStopLossHit = (size, matchedPrice, LTP, side, ticks, strategy) => {
  //* We turn the prices into floating point numbers in case strings are passed
  matchedPrice = Number(matchedPrice);
  LTP = Number(LTP);

  if (((side === 'BACK' && LTP <= matchedPrice) || (side === 'LAY' && LTP >= matchedPrice))) return { targetMet: false };
  if (strategy == 'ticks') return findStopPosition(matchedPrice, LTP, ticks, side);
  if (strategy == 'percent') return findStopPositionForPercent(size, matchedPrice, LTP, ticks, side);
  return findStopPosition(matchedPrice, LTP, ticks, side);
};

/**
 * This function is used to calculate the position of the stop loss.
 * For example a matched price of 2.02 for the lay side with a stop loss
 * with 5 ticks would return 1.96 = 2.02 > 2.00 > 1.99 > 1.98 > 1.97 > 1.96
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} ticks - Number of ticks for the stop, or percentage of price
 * @param {string} side - Back or Lay *REQUIRED*
 * @return {Object} {targetMet, stopPrice}
 */

const findStop = (matchedPrice, ticks, side) => {
  matchedPrice = parseFloat(matchedPrice);
  ticks = side == 'BACK' ? +ticks : -ticks;
  const stopAt = Math.floor(ALL_PRICES.indexOf(matchedPrice) + ticks);
  return parseFloat(ALL_PRICES[stopAt]).toFixed(2);
};

const findStopPosition = (matchedPrice, LTP, ticks, side) => {
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

/**
 * This function is used to calculate the position of the stop loss for percentages.
 * @param {number} size - The position of the bet e.g. £10
 * @param {number} matchedPrice - The price the bet was matched at e.g. 2.56
 * @param {number} percent - The current percent loss to stop the trade at
 * @param {string} side - Back or Lay *REQUIRED*
 * @return {string} The price at which the trade will stop
 */
const findStopPositionForPercent = (size, matchedPrice, LTP, percent, side) => {
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

export {
  checkStopLossHit, findStop, findStopPosition, findStopPositionForPercent,
};
