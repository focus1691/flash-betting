import { twoDecimalPlaces } from './BettingCalculations';
import { calcBackBet } from '../TradingStategy/HedingCalculator';

const marketHasBets = (marketId, bets) => (Object.values(bets.matched))
  .filter((order) => order.marketId === marketId)
  .length > 0;


/**
 * TODO The two functions below can be simplified into one. The first calculates the selection profit, and the second the selection loss.
 * The only difference between the two is where the 'side' ternary is computed
 * 
 * @param {The market id} marketId 
 * @param {The selection id} selectionId 
 * @param {Bets object for an open tab} bets 
 * @returns the profit for a selection from the bets placed
 */
const getPLForRunner = (marketId, selectionId, bets) => twoDecimalPlaces(Object.values(bets.matched)
  .filter((order) => order.marketId === marketId)
  .map((order) => {
    if (order.selectionId === selectionId) {
      return order.side === 'LAY' ? -calcBackBet(order.price, order.size) : calcBackBet(order.price, order.size);
    }
    return order.side === 'BACK' ? -order.size : order.size;
  })
  .reduce((acc, total) => acc + total, 0));

const getLossForRunner = (marketId, selectionId, bets) => twoDecimalPlaces(Object.values(bets.matched)
  .filter((order) => order.marketId === marketId)
  .map((order) => {
    if (order.selectionId === selectionId) {
      return order.side === 'BACK' ? -calcBackBet(order.price, order.size) : calcBackBet(order.price, order.size);
    }
    return order.side === 'LAY' ? -order.size : order.size;
  })
  .reduce((acc, total) => acc + total, 0));

export { marketHasBets, getPLForRunner, getLossForRunner };
