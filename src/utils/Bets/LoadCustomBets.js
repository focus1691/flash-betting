import { getAllBets } from '../../http/dbHelper';

export default async (marketId) => {
  const backOrders = {};
  const layOrders = {};
  const stopEntryOrders = {};
  const tickOffsetOrders = {};
  const fillOrKillOrders = {};
  const stopLossOrders = {};

  const bets = await getAllBets(marketId);
  bets.forEach((bet) => {
    if (bet.marketId === marketId) {
      switch (bet.strategy) {
        case 'Back':
          backOrders[bet.selectionId] = backOrders[bet.selectionId] ? backOrders[bet.selectionId].concat(bet) : [bet];
          break;
        case 'Lay':
          layOrders[bet.selectionId] = layOrders[bet.selectionId] ? layOrders[bet.selectionId].concat(bet) : [bet];
          break;
        case 'Stop Entry':
          stopEntryOrders[bet.selectionId] = stopEntryOrders[bet.selectionId] ? stopEntryOrders[bet.selectionId].concat(bet) : [bet];
          break;
        case 'Tick Offset':
          tickOffsetOrders[bet.selectionId] = bet;
          break;
        case 'Fill Or Kill':
          fillOrKillOrders[bet.betId] = bet;
          break;
        case 'Stop Loss':
          stopLossOrders[bet.selectionId] = bet;
          break;
        default:
          break;
      }
    }
  });
  return { backOrders, layOrders, stopEntryOrders, tickOffsetOrders, fillOrKillOrders, stopLossOrders };
};
