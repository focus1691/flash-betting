import { getTimeToDisplay } from '../TradingStategy/BackLay';
import { formatPrice } from '../ladder/CreateFullLadder';

/**
 * This function sums all matched bets to find the total.
 * @param {object} ladder - The ladder containing the price data for a runner.
 * @return {number} The total matched bets for the runner.
 */
const sumMatchedBets = (ladder) => {
  const sum = Object.keys(ladder).reduce(
    (sum, key) => sum + parseFloat(ladder[key].tv[0] || 0),
    0,
  );
  return sum ? Math.floor(sum) : '';
};

/**
 * This function calculates the percent difference between matched and current prices.
 * @param {number} size - The ladder containing the price data for a runner.
 * @param {number} matchedPrice - The price the bet was placed at for runner.
 * @param {number} currentPrice - The current trading price of the runner
 * @return {percentDifference} The percent increase or decrease.
 */
const calcPercentDifference = (size, matchedPrice, currentPrice) => {
  const initialPL = Math.round((size * matchedPrice - size) * 100) / 100;
  const currPL = Math.round((size * currentPrice - size) * 100) / 100;

  // Round to remove the decimals and absolute to remove negatives
  let percentDifference = Math.abs(Math.round((currPL - initialPL) * 100) / 100) / currPL * 100;
  percentDifference = Math.floor(percentDifference);

  return percentDifference;
};

const twoDecimalPlaces = (num) => parseFloat((Math.round(num * 100) / 100).toFixed(2));

const calcBackProfit = (stake, price, side) => {
  const profit = parseFloat((stake * price - stake).toFixed(2));
  if (side === 0) return profit || 0;
  if (side === 1) return -profit || 0;
};

const calcLiability = (stake, side) => {
  if (side === 0) return -stake;
  return Math.abs(stake);
};

const colorForBack = (side, pl = 0) => {
  if (side === 0 && pl > 0) return '#01CC41';
  return 'red';
};

const colorForLay = (side) => (side === 0 ? 'red' : '#01CC41');

const colorForOrder = (side, strategy) => ({
  backgroundColor: (side === 'BACK' || strategy === 'Back') ? '#A6D8FF' : (side === 'LAY' || strategy === 'Lay') ? '#FAC9D7' : null,
});

const PLColor = (PL) => ({
  color: PL === '0.00' ? 'black' : PL > 0 ? 'green' : 'red',
});

const getStrategyAbbreviation = (trailing, hedged) => {
  if (trailing && hedged) return 'th';
  if (!trailing && hedged) return 'h';
  if (trailing && !hedged) return 't';
  return '';
};

const getStrategySuffix = (strategy, stopEntryCondition, targetLTP, strategyAbbreviation) => {
  let suffix = '';
  switch (strategy) {
    case 'Stop Loss':
      suffix = 'SL ';
      break;
    case 'Tick Offset':
      suffix = 'T.O.';
      break;
    case 'Back':
      suffix = 'B';
      break;
    case 'Lay':
      suffix = 'L';
      break;
    case 'Stop Entry':
      suffix = `${stopEntryCondition + formatPrice(targetLTP)}SE`;
      break;
    default:
      break;
  }
  suffix += strategyAbbreviation;
  return suffix;
};

const getStrategySuffixForPL = (order, strategyAbbreviation, marketStartTime) => {
  let suffix = '';
  switch (order.strategy) {
    case 'Stop Loss':
      suffix = 'SL ';
      break;
    case 'Tick Offset':
      suffix = 'T.O.';
      break;
    case 'Back':
      suffix = `${getTimeToDisplay(order, marketStartTime)}s${order.executionTime === 'Before' ? '-' : '+'}`;
      break;
    case 'Lay':
      suffix = `${getTimeToDisplay(order, marketStartTime)}s${order.executionTime === 'Before' ? '-' : '+'}`;
      break;
    case 'Stop Entry':
      suffix = `${order.stopEntryCondition + formatPrice(order.targetLTP)}SE`;
      break;
    default:
      suffix = calcBackProfit(order.size, order.price, order.side === 'BACK' ? 0 : 1) + strategyAbbreviation;
      break;
  }
  return suffix;
};

export {
  sumMatchedBets,
  calcPercentDifference,
  calcBackProfit,
  calcLiability,
  colorForBack,
  colorForLay,
  colorForOrder,
  PLColor,
  twoDecimalPlaces,
  getStrategyAbbreviation,
  getStrategySuffix,
  getStrategySuffixForPL,
};
