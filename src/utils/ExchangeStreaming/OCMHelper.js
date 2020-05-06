/**
 * This function checks if the stoploss's corresponding order is matched.
 * @param {object} stopLossList - The object containing all the stoploss information.
 * @param {object} selectionId - The id that contains the stoploss that will be focused on. 
 * @param {function} order - The current order state with sizeMatched and rfs.
 * @return {Boolean} Whether the stop loss has been matched
 */

export const checkStopLossForMatch = (stopLossList, selectionId, order) => {
    return stopLossList[selectionId] && stopLossList[selectionId].rfs === order.rfs && order.sr === 0;
}

/**
 * This function checks if the tick offset matches the percentage needed.
 * @param {object} tickOffsetList - The object containing all the tickOffset information.
 * @param {object} order - The current order state with sizeMatched and rfs. 
 * @return {Boolean} Whether or not the tick offset has been matched.
 */
export const checkTickOffsetForMatch = (tickOffsetList, order) => {
    if (tickOffsetList[order.rfs] && order.sm / tickOffsetList[order.rfs].size >= tickOffsetList[order.rfs].percentageTrigger / 100) return true;
    return false;
}