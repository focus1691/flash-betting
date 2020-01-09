import { checkStopLossHit } from '../TradingStategy/StopLoss'
import { stopEntryCheck } from '../TradingStategy/StopEntry'

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
    const stopEntryArray = stopEntryList[selectionId]
    const newStopEntryList = Object.assign({}, previousNewStopEntryList)

    if (stopEntryArray !== undefined) {
        try {
            const indexesToRemove = await stopEntryCheck(currentLTP, stopEntryArray, onPlaceOrder, unmatchedBets, matchedBets, testing);
            // if the array length has some items left, then keep it 
            if (stopEntryArray.length > indexesToRemove.length) {
                newStopEntryList[selectionId] = stopEntryArray.filter((item, index) => indexesToRemove.indexOf(index) === -1)
            } else {
                delete newStopEntryList[selectionId]
            }
        } catch (e) {}
    }

    return newStopEntryList
}

/**
 * This function checks if the the LTP increased and adds to the tickOffset if it did.
 * @param {object} stopLossList - The object containing all the stopLoss information.
 * @param {number} selectionId - The id that contains the stoploss that will be focused on. 
 * @param {number} currentLTP - The current LTP we compare from
 * @param {number} oldMaxLadderLTP - The highest old LTP we compare to. 
 * @return {object} The new stoploss with the changes to the tickOffset.
*/
export const stopLossTrailingChange = (stopLossList, selectionId, currentLTP, oldMaxLadderLTP) => {
    let adjustedStopLoss = Object.assign({}, stopLossList[selectionId])
    if (stopLossList[selectionId].trailing && currentLTP > oldMaxLadderLTP) {
        adjustedStopLoss.tickOffset = adjustedStopLoss.tickOffset + 1; 
    }

    fetch('/api/update-order', {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(adjustedStopLoss)
    }).catch(console.log)

    return adjustedStopLoss
}


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
export const stopLossCheck = (adjustedStopLoss, selectionId, currentLTP, onPlaceOrder, stopLossOrdersToRemove, previousAdjustedStopLossList, unmatchedBets, matchedBets) => {

    let newStopLossOrdersToRemove = [...stopLossOrdersToRemove];
    const adjustedStopLossList = Object.assign({}, previousAdjustedStopLossList)

    if (adjustedStopLoss.rfs === undefined || (adjustedStopLoss.rfs && adjustedStopLoss.assignedIsOrderMatched)) {
        const units = adjustedStopLoss.units ? adjustedStopLoss.units.toLowerCase() : "ticks";

        const stopLossCheck = checkStopLossHit(adjustedStopLoss.size, adjustedStopLoss.price, currentLTP, adjustedStopLoss.side.toLowerCase(), adjustedStopLoss.tickOffset, units, adjustedStopLoss.rfs !== undefined);
        if (stopLossCheck.targetMet) {
            onPlaceOrder({
                marketId: adjustedStopLoss.marketId,
                selectionId: adjustedStopLoss.selectionId,
                side: adjustedStopLoss.side,
                size: adjustedStopLoss.size,
                price: stopLossCheck.priceReached,
                unmatchedBets: unmatchedBets,
                matchedBets: matchedBets
            })

            newStopLossOrdersToRemove = newStopLossOrdersToRemove.concat(adjustedStopLoss);

            delete adjustedStopLossList[selectionId];
          
        } else {
            adjustedStopLossList[selectionId] = adjustedStopLoss;
        }
    }

    return {
        adjustedStopLossList: adjustedStopLossList,
        stopLossOrdersToRemove: newStopLossOrdersToRemove
    }
    
}