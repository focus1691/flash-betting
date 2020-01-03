

import { twoDecimalPlaces } from "./BettingCalculations";
import { calcBackBet } from "../TradingStategy/HedingCalculator";

const marketHasBets = (marketId, bets) => {
    return (Object.values(bets.matched))
        .filter(order => order.marketId === marketId)
        .length > 0;
};

const getPLForRunner = (marketId, selectionId, bets) => {
    return twoDecimalPlaces(Object.values(bets.matched)
        .filter(order => order.marketId === marketId)
        .map(order => {
        if (order.selectionId === selectionId) {
           return order.side === "LAY" ? -calcBackBet(order.price, order.size) : calcBackBet(order.price, order.size);
         } else {
            return order.side === "BACK" ? -order.size : order.size;
         }
        })
        .reduce((acc, total) => {
            return acc + total;
        }, 0));
};

const getLossForRunner = (marketId, selectionId, bets) => {
    return twoDecimalPlaces(Object.values(bets.matched)
        .filter(order => order.marketId === marketId)
        .map(order => {
            if (order.selectionId === selectionId) {
                return order.side === "BACK" ? -calcBackBet(order.price, order.size) : calcBackBet(order.price, order.size);
            } else {
                return order.side === "LAY" ? -order.size : order.size;
            }
        })
        .reduce((acc, total) => {
            return acc + total;
        }, 0));
};


export { marketHasBets, getPLForRunner, getLossForRunner };