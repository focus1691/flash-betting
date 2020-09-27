import { calcBackBet } from '../TradingStategy/HedingCalculator';

const calcHedgeProfit = (PLHedgeNumber, side) => (PLHedgeNumber && PLHedgeNumber.side === side && PLHedgeNumber.profit ? PLHedgeNumber.profit : undefined);

const hedgeStyle = (unmatchedBetsOnRow, hedgePL) => ({ color: unmatchedBetsOnRow ? 'black' : `${hedgePL >= 0 ? 'green' : 'red'}` });

const calcOddsOnPriceHover = (price, side, selectionId, hoveredSelectionId, PL) => (
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

export { calcHedgeProfit, hedgeStyle, calcOddsOnPriceHover };
