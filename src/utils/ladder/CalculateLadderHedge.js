import { calculateHedgeProfit } from '../TradingStategy/HedingCalculator';
import { twoDecimalPlaces, calcBackProfit } from '../Bets/BettingCalculations';

/**
 * This function calculates a hedge column in the ladder
 * @param {number} odds - The odds we are calculating for
 * @param {number} hedgeType - The setting that is associated with what happens to the columns (hedged, pl, none)
 * @param {number} stake - The current stake value that is selected, [2, 4, 6, 8, 10] <- default 2
 * @param {number} pl - The current profit/loss of the ladder
 * @return {object} side, profit
 */
export default (price, selectionMatchedBets, ladderUnmatched, stake, pl) => {
  // find which side the column is supposed to be on
  const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side), 0) <= 0 ? 'BACK' : 'LAY';

  if (ladderUnmatched === 'hedged') {
    // calculate the profit based on the current row (the odds decide this)
    const profit = selectionMatchedBets.reduce((prev, bet) => prev + calculateHedgeProfit(bet.side, parseFloat(bet.size), parseFloat(bet.price), parseFloat(price)), 0);

    // get the offset to the size ex. 2 BACK = 2 LAY
    const offset = selectionMatchedBets.reduce((a, b) => {
      if (b.side === 'BACK') return a - b.size;
      return a + b.size;
    }, 0).round(2);

    // calculate the size required to bet
    const size = side === 'BACK' ? twoDecimalPlaces((parseFloat(offset) - parseFloat(profit))) : twoDecimalPlaces((parseFloat(profit) - parseFloat(offset)));

    return { side, profit, price, size };
  }
  if (ladderUnmatched === 'pl') {
    return { side: 'BACK', profit: parseFloat(calcBackProfit(parseFloat(stake), price, 0)) + parseFloat(pl), size: stake };
  }
  return undefined;
};
