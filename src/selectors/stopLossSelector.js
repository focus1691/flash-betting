import { createSelector } from "reselect"
import { findStopPosition, findStopPositionForPercent } from "../utils/TradingStategy/StopLoss";

const getStopLossSelector = (state, {selectionId, price, side}) => ({stopLoss: state[selectionId], price: price, side: side})

export const getStopLoss = createSelector(
    getStopLossSelector,
    ({stopLoss, price, side}) => {
        if (!stopLoss) return undefined
        
        const actualPos = stopLoss.tickOffset > 0 ? stopLoss.side === side ?
            stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()):
            findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) : false : stopLoss.price;
        
        if (parseFloat(actualPos) === parseFloat(price) && stopLoss.side === side) { 
            return {stopLoss, actualPos: actualPos}
        } 
        return undefined
    }
)
