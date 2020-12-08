import { secToMin } from '../DateCalculator';
import { removeBet } from '../../http/dbHelper';

const isBetBeforeMarketReady = (marketStartTime, order) => {
  const remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000);
  return order.executionTime === 'Before' && remainingTime - order.timeOffset <= 0;
};

const isBetAfterMarketReady = (marketStartTime, order) => {
  const timePassed = Math.abs((new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000));
  return order.executionTime === 'After' && timePassed >= order.timeOffset;
};

const checkBackBets = async (list, marketStartTime, placeOrder, inPlay, removeBackBet) => {
  const selectionIds = Object.keys(list);

  for (let i = 0; i < selectionIds.length; i += 1) {
    const BACK = list[selectionIds[i]];

    for (let j = 0; j < BACK.length; j += 1) {
      const isReady = inPlay ? isBetAfterMarketReady(marketStartTime, BACK[j]) : isBetBeforeMarketReady(marketStartTime, BACK[j]);

      if (isReady) {
        placeOrder({
          marketId: BACK[j].marketId,
          selectionId: BACK[j].selectionId,
          side: 'BACK',
          size: BACK[j].size,
          price: BACK[j].price,
        });
        removeBet({ rfs: BACK[j].rfs }); // DB
        removeBackBet({ selectionId: BACK[j].selectionId, rfs: BACK[j].rfs }); // Back action
      }
    }
  }
};

const checkLayBets = async (list, marketStartTime, placeOrder, inPlay, removeLayBet) => {
  const selectionIds = Object.keys(list);

  for (let i = 0; i < selectionIds.length; i += 1) {
    const LAY = list[selectionIds[i]];

    for (let j = 0; j < LAY.length; j += 1) {
      const isReady = inPlay ? isBetAfterMarketReady(marketStartTime, LAY[j]) : isBetBeforeMarketReady(marketStartTime, LAY[j]);

      if (isReady) {
        placeOrder({
          marketId: LAY[j].marketId,
          selectionId: LAY[j].selectionId,
          side: 'LAY',
          size: LAY[j].size,
          price: LAY[j].price,
        });
        removeBet({ rfs: LAY[j].rfs }); // DB
        removeLayBet({ selectionId: LAY[j].selectionId, rfs: LAY[j].rfs }); // Lay action
      }
    }
  }
};

const getTimeToDisplay = (order, marketStartTime) => {
  let remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000);

  if (order.executionTime === 'After') {
    return secToMin(remainingTime + order.timeOffset);
  }
  remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000);
  return secToMin(remainingTime - order.timeOffset);
};

export { checkBackBets, checkLayBets, getTimeToDisplay };
