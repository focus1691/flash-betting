import { calculateHedgeProfit } from '../TradingStategy/HedingCalculator';
import { calcBackProfit } from '../Bets/BettingCalculations';

// eslint-disable-next-line no-extend-native
Number.prototype.round = function(places) {
	// eslint-disable-next-line prefer-template
	return +(Math.round(this + "e+" + places) + "e-" + places);
};

/**
 * This function calculates a hedge column in the ladder
 * @param {number} odds - The odds we are calculating for
 * @param {number} hedgeType - The setting that is associated with what happens to the columns (hedged, pl, none)
 * @param {number} stake - The current stake value that is selected, [2, 4, 6, 8, 10] <- default 2
 * @param {number} pl - The current profit/loss of the ladder
 * @return {object} side, profit
 */
export default (odds, selectionMatchedBets, hedgeType, stake, pl) => {
  console.log(`calculate ladder hedge ${odds}`);
  // find which side the column is supposed to be on
  const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side), 0) <= 0 ? 'BACK' : 'LAY';
  const multiplePrices = typeof odds === 'object';

  const smallestPrice = multiplePrices ? Math.min(...odds) : odds;
  const largestPrice = multiplePrices ? Math.max(...odds) : odds;

  const price = side === 'BACK' ? smallestPrice : largestPrice;

  if (hedgeType === 'hedged') {
    // calculate the profit based on the current row (the odds decide this)
    const profitArray = selectionMatchedBets.map((bet) => (bet.side === 'LAY' ? -1 : 1) * calculateHedgeProfit(parseFloat(bet.size), parseFloat(bet.price), parseFloat(price)));

    // combine this all, this will be the white space
    const profit = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);

    // get the offset to the size ex. 2 BACK = 2 LAY
    const offset = selectionMatchedBets.reduce((a, b) => {
      if (b.side === 'BACK') return a - b.size;
      return a + b.size;
    }, 0);

    // calculate the size required to bet
    const size = side === 'BACK' ? (parseFloat(offset) - parseFloat(profit)).round(2) : (parseFloat(profit) - parseFloat(offset)).round(2);

    return { side, profit, price, size };
  }
  if (hedgeType === 'pl') {
    return { side: 'BACK', profit: parseFloat(calcBackProfit(parseFloat(stake), odds, 0)) + parseFloat(pl), size: stake };
  }
  return undefined;
};
