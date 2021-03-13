import { removeBet } from '../../http/dbHelper';
import { secondsToHms } from '../DateHelper';

export const isBetBeforeMarketReady = (marketStartTime, order) => {
  const remainingTime = new Date(marketStartTime).valueOf() / 1000 - new Date().valueOf() / 1000;
  return order.executionTime === 'Before' && remainingTime - order.timeOffset <= 0;
};

export const isBetAfterMarketReady = (marketStartTime, order) => {
  const timePassed = Math.abs(new Date(marketStartTime).valueOf() / 1000 - new Date().valueOf() / 1000);
  return order.executionTime === 'After' && timePassed >= order.timeOffset;
};

export const checkBackLayBetsAndExecute = (list, marketStartTime, placeOrder, inPlay, removeSelectionBets) => {
  const selectionIds = Object.keys(list);

  for (let i = 0; i < selectionIds.length; i += 1) {
    const bets = list[selectionIds[i]];

    for (let j = 0; j < bets.length; j += 1) {
      const isReady = inPlay ? isBetAfterMarketReady(marketStartTime, bets[j]) : isBetBeforeMarketReady(marketStartTime, bets[j]);

      if (isReady) {
        placeOrder({
          marketId: bets[j].marketId,
          selectionId: bets[j].selectionId,
          side: bets[j].side,
          size: bets[j].size,
          price: bets[j].price,
        });
        removeBet({ rfs: bets[j].rfs }); // DB
        removeSelectionBets({ selectionId: bets[j].selectionId, rfs: bets[j].rfs }); // Back action
      }
    }
  }
};

export const getTimeToDisplay = (order, marketStartTime) => {
  const remainingTime = new Date(marketStartTime).valueOf() / 1000 - new Date().valueOf() / 1000;

  if (order.executionTime === 'After') {
    return secondsToHms(remainingTime + order.timeOffset);
  }
  return secondsToHms(remainingTime - order.timeOffset);
};
