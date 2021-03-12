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

const twoDecimalPlaces = (num) => parseFloat((Math.round(num * 100) / 100).toFixed(2));

const calcBackProfit = (stake, price, side) => {
  const profit = parseFloat((stake * price - stake).toFixed(2));
  if (side === 'BACK') return profit || 0;
  if (side === 'LAY') return -profit || 0;
  return 0;
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
  backgroundColor: (side === 'BACK' || strategy === 'Back') ? '#007aaf' : (side === 'LAY' || strategy === 'Lay') ? '#d4696b' : null,
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
  switch (order.strategy) {
    case 'Stop Loss':
      return 'SL ';
    case 'Tick Offset':
      return 'T.O.';
    case 'Back':
      return `${getTimeToDisplay(order, marketStartTime)}s${order.executionTime === 'Before' ? '-' : '+'}`;
    case 'Lay':
      return `${getTimeToDisplay(order, marketStartTime)}s${order.executionTime === 'Before' ? '-' : '+'}`;
    case 'Stop Entry':
      return `${order.stopEntryCondition + formatPrice(order.targetLTP)}SE`;
    default:
      return calcBackProfit(order.size, order.price, order.side) + strategyAbbreviation;
  }
};

export {
  sumMatchedBets,
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
