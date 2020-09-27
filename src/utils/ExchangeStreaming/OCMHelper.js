/**
 * This function checks if the stoploss's corresponding order is matched.
 * @param {object} stopLossList - The object containing all the stoploss information.
 * @param {object} selectionId - The id that contains the stoploss that will be focused on.
 * @param {function} order - The current order state with sizeMatched and rfs.
 * @return {Boolean} Whether the stop loss has been matched
 */

export const checkStopLossTrigger = (stopLossList, selectionId, order) => stopLossList[selectionId] && !stopLossList[selectionId].assignedIsOrderMatched && stopLossList[selectionId].rfs == order.rfs && order.sizeRemaining == 0;

/**
 * This function checks if the tick offset matches the percentage needed.
 * @param {object} tickOffsetList - The object containing all the tickOffset information.
 * @param {object} order - The current order state with sizeMatched and rfs.
 * @return {Boolean} Whether or not the tick offset has been matched.
 */
export const checkTickOffsetTrigger = (tickOffsetList, order) =>
// if (tickOffsetList[order.rfs]) {
//     console.log(`size matched: ${order.sizeMatched}, TOS size: ${tickOffsetList[order.rfs].size}, Trigger: ${tickOffsetList[order.rfs].percentageTrigger}, Triggered?
//     ${tickOffsetList[order.rfs] && order.sizeMatched / tickOffsetList[order.rfs].size >= tickOffsetList[order.rfs].percentageTrigger / 100}`);
// }
  tickOffsetList[order.rfs] && order.sizeMatched / tickOffsetList[order.rfs].size >= tickOffsetList[order.rfs].percentageTrigger / 100;
