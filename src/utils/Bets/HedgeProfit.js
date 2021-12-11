import { calcBackBet } from '../TradingStategy/HedingCalculator';

export const calcHedgeProfit = (hedge, side) => (hedge && hedge.side === side && hedge.profit ? hedge.profit : null);

export const calcOddsOnPriceHover = (price, side, selectionId, hoveredSelectionId, PL) => (
  ((side === 'BACK' && hoveredSelectionId === selectionId) || (side === 'LAY' && hoveredSelectionId !== selectionId)
    ? 1
    : -1)
  * parseFloat(
    calcBackBet(price, 2)
    + ((side === 'BACK' && hoveredSelectionId === selectionId)
      || (side === 'LAY' && hoveredSelectionId !== selectionId)
      ? 1
      : -1)
    * parseFloat(PL),
  ).toFixed(2)
);
