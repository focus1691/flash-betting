import crypto from 'crypto';
import updateCustomOrder from '../../http/updateCustomOrder';
import { secondsToHms } from '../DateHelper';

export const isBetBeforeMarketReady = (marketStartTime, beforeAfter, timeOffset) => {
  const now = new Date();
  const executionTime = new Date(marketStartTime);
  executionTime.setSeconds(executionTime.getSeconds() - timeOffset);

  return beforeAfter === 'Before' && now >= executionTime;
};

export const isBetAfterMarketReady = (marketStartTime, beforeAfter, timeOffset) => {
  const now = new Date();
  const executionTime = new Date(marketStartTime);
  executionTime.setSeconds(executionTime.getSeconds() + timeOffset);

  return beforeAfter === 'After' && now >= executionTime;
};

export const checkBackLayBetsAndExecute = (list, marketStartTime, placeOrder, inPlay, removeSelectionBets, dispatch) => {
  const selectionIds = Object.keys(list);

  for (let i = 0; i < selectionIds.length; i += 1) {
    const bets = list[selectionIds[i]];

    for (let j = 0; j < bets.length; j += 1) {
      const { rfs, marketId, selectionId, side, size, price, executionTime, timeOffset } = bets[j];
      const isReady = inPlay ? isBetAfterMarketReady(marketStartTime, executionTime, timeOffset) : isBetBeforeMarketReady(marketStartTime, executionTime, timeOffset);

      if (isReady) {
        const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
        dispatch(placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef }));
        updateCustomOrder('remove-bet', { rfs }); // DB
        dispatch(removeSelectionBets({ selectionId, rfs })); // Back action
      }
    }
  }
};

export const getTimeToDisplay = (order, marketStartTime) => {

  if (order.executionTime === 'After') {
    const remainingTime = new Date(marketStartTime).valueOf() / 1000 - new Date().valueOf() / 1000;
    return secondsToHms(remainingTime + order.timeOffset);
  }
  const remainingTime = new Date(marketStartTime).valueOf() / 1000 - new Date().valueOf() / 1000;
  return secondsToHms(remainingTime > order.timeOffset ? remainingTime - order.timeOffset : order.timeOffset - remainingTime);
};
