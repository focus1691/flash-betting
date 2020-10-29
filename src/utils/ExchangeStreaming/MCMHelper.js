import { checkStopLossHit } from '../TradingStategy/StopLoss';
import { stopEntryCheck } from '../TradingStategy/StopEntry';

/**
 * This function checks if the LTP reaches the threshold that the stopEntry has.
 * @param {object} stopLossList - The object containing all the stopEntry information.
 * @param {number} selectionId - The id that contains the stopEntry that will be focused on.
 * @param {number} currentLTP - The current LTP we compare from
 * @param {function} onPlaceOrder - The method for placing an order.
 * @param {number} previousNewStopEntryList - The object modified after stopEntry orders are checked.
 * @param {object} unmatchedBets - The unmatchedBets that has to be passed into onPlaceOrder.
 * @param {object} matchedBets - The matchedBets that has to be passed into onPlaceOrder.
 * @return {object} The new stopEntry with the ones that passed the test removed.
*/
export const stopEntryListChange = async (stopEntryList, selectionId, currentLTP, onPlaceOrder, previousNewStopEntryList, unmatchedBets, matchedBets, testing = false) => {
  const stopEntryArray = stopEntryList[selectionId];
  const newStopEntryList = { ...previousNewStopEntryList };

  if (stopEntryArray !== undefined) {
    try {
      const indexesToRemove = await stopEntryCheck(currentLTP, stopEntryArray, onPlaceOrder, unmatchedBets, matchedBets, testing);
      // if the array length has some items left, then keep it
      if (stopEntryArray.length > indexesToRemove.length) {
        newStopEntryList[selectionId] = stopEntryArray.filter((item, index) => indexesToRemove.indexOf(index) === -1);
      } else {
        delete newStopEntryList[selectionId];
      }
    } catch (e) {}
  }

  return newStopEntryList;
};

/**
 * This function checks if the the LTP increased and adds to the tickOffset if it did.
 * @param {object} stopLossList - The object containing all the stopLoss information.
 * @param {number} selectionId - The id that contains the stoploss that will be focused on.
 * @param {number} currentLTP - The current LTP we compare from
 * @param {number} oldMaxLadderLTP - The highest old LTP we compare to.
 * @return {object} The new stoploss with the changes to the tickOffset.
*/
export const stopLossTrailingChange = (stopLossList, selectionId, currentLTP, oldMaxLadderLTP) => null;

/**
 * This function checks if the LTP reaches the threshold that the stopLoss has.
 * @param {object} adjustedStopLoss - The stoploss object that has it's trailing updated.
 * @param {object} selectionId - The id that contains the stoploss that will be focused on.
 * @param {number} currentLTP - The current LTP we compare from
 * @param {function} onPlaceOrder - The method for placing an order.
 * @param {array} stopLossOrdersToRemove - The orders that already were planned to be removed.
 * @param {object} previousAdjustedStopLossList - The stoplosslist that has to be adjusted.
 * @param {object} unmatchedBets - The unmatchedBets that has to be passed into onPlaceOrder.
 * @param {object} matchedBets - The matchedBets that has to be passed into onPlaceOrder.
 * @return {object} The new {adjustedStopLossList, stopLossOrdersToRemove}.
*/
export const stopLossCheck = (SL, LTP) => {
  const units = SL.units ? SL.units : 'ticks';
  return checkStopLossHit(SL.size, SL.price, LTP, SL.side, SL.ticks, units);
};
