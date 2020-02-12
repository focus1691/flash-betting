import { createSelector } from "reselect";
import { findStopPosition, findStopPositionForPercent } from "../utils/TradingStategy/StopLoss";


const getTickOffsetSelector = (tickOffset, { refs, price, side}) => ({
    tickOffset: tickOffset[refs],
    price: price,
    side: side
});

export const getTickOffset = createSelector(getTickOffsetSelector, ({ tickOffset, price, side }) => {
    if (!tickOffset) return undefined;

    
});