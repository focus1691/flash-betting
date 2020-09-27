import { secToMin } from '../DateCalculator';
import { removeOrder } from '../../actions/order';

const isOrderBeforeMarketReady = (marketStartTime, order) => {
  const remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000);
  return order.executionTime === 'Before' && remainingTime - order.timeOffset <= 0;
};

const isOrderAfterMarketReady = (marketStartTime, order) => {
  const timePassed = Math.abs((new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000));
  return order.executionTime === 'After' && timePassed >= order.timeOffset;
};

const checkBackAndLayOrders = async (list, marketStartTime, onPlaceOrder, marketId, side, matchedBets, unmatchedBets, inPlay) => {
  const newList = { ...list };

  Object.keys(list).map((selectionId) => {
    const newSelectionArray = newList[selectionId];
    let indexesToRemove = [];
    // this is for the remove orders
    list[selectionId].map((order, index) => {
      const isReady = inPlay ? isOrderAfterMarketReady(marketStartTime, order) : isOrderBeforeMarketReady(marketStartTime, order);

      if (isReady) {
        onPlaceOrder({
          marketId,
          selectionId: parseInt(selectionId),
          side,
          size: order.size,
          price: order.price,
          matchedBets,
          unmatchedBets,
        });

        indexesToRemove = indexesToRemove.concat(index);

        removeOrder(order);
      }
    });

    newList[selectionId] = newSelectionArray.filter((item, index) => indexesToRemove.indexOf(index) === -1);
    if (newList[selectionId].length === 0) {
      delete newList[selectionId];
    }
  });
  return newList;
};

const getTimeToDisplay = (order, marketStartTime) => {
  let remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000);

  if (order.executionTime === 'After') {
    return secToMin(remainingTime + order.timeOffset);
  }
  remainingTime = (new Date(marketStartTime).valueOf() / 1000) - (new Date().valueOf() / 1000);
  return secToMin(remainingTime - order.timeOffset);
};

export { checkBackAndLayOrders, getTimeToDisplay };
