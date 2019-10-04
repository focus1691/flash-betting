export const stopLossTrailingChange = (stopLossList, selectionId, newLTP, oldLadderLTP) => {
    let adjustedStopLoss = Object.assign({}, stopLossList[selectionId])
    if (stopLossList[selectionId].trailing && newLTP > oldLadderLTP) {
        adjustedStopLoss.tickOffset = adjustedStopLoss.tickOffset + 1; 
    }
    return adjustedStopLoss
}