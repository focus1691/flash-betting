import { getTimeToDisplay } from '../TradingStategy/BackLay';
import { formatPrice } from './PriceCalculations';

/**
 * This function sums all matched bets to find the total.
 * @param {object} ladder - The ladder containing the price data for a runner.
 * @return {number} The total matched bets for the runner.
 */
export const sumMatchedBets = (ladder) => {
  const sum = Object.keys(ladder).reduce(
    (sum, key) => sum + parseFloat(ladder[key].tv[0] || 0),
    0,
  );
  return sum ? Math.floor(sum) : '';
};

/**
 * This rounding function is for numbers, and not for string representation of a value (for display purposes)
 * 
 * @param {the number to round} num 
 * @returns Rounds a number to two decimal places
 */
export const twoDecimalPlaces = (num) => parseFloat(num).round(2);

export const calcBackProfit = (stake, price, side) => {
  const profit = twoDecimalPlaces(stake * price - stake);
  if (side === 'BACK') return profit || 0;
  if (side === 'LAY') return -profit || 0;
  return 0;
};

export const calcLiability = (stake, side) => {
  if (side === 0) return -stake;
  return Math.abs(stake);
};

export const colorForBack = (side, pl = 0) => {
  if (side === 'BACK' && pl > 0) return '#01CC41';
  return 'red';
};

export const colorForLay = (side) => (side === 0 ? 'red' : '#01CC41');

export const colorForOrder = (side, strategy) => ({
  backgroundColor: (side === 'BACK' || strategy === 'Back') ? '#007aaf' : (side === 'LAY' || strategy === 'Lay') ? '#d4696b' : null,
});

export const getStrategyAbbreviation = (trailing, hedged) => {
  if (trailing && hedged) return 'th';
  if (!trailing && hedged) return 'h';
  if (trailing && !hedged) return 't';
  return '';
};

export const getStrategySuffix = (strategy, stopEntryCondition, targetLTP, strategyAbbreviation) => {
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

export const getStrategySuffixForPL = (order, strategyAbbreviation, marketStartTime) => {
  switch (order.strategy) {
    case 'Stop Loss':
      return 'SL ';
    case 'Tick Offset':
      return 'T.O.';
    case 'Back':
      return `B ${getTimeToDisplay(order, marketStartTime)}`;
    case 'Lay':
      return `L ${getTimeToDisplay(order, marketStartTime)}`;
    case 'Stop Entry':
      return `${order.stopEntryCondition + formatPrice(order.targetLTP)}SE`;
    default:
      return calcBackProfit(order.size, order.price, order.side) + strategyAbbreviation;
  }
};
