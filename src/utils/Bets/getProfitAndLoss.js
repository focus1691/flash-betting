

import { twoDecimalPlaces } from "../PriceCalculator";
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
                switch (order.side) {
                    case "BACK":
                        return calcBackBet(order.price, order.size);
                    case "LAY":
                        return -calcBackBet(order.price, order.size);
                    default:
                        return calcBackBet(order.price, order.size);
                }
            } else {
                switch (order.side) {
                    case "BACK":
                        return -order.size;
                    case "LAY":
                        return order.size;
                    default:
                        return -order.size;
                }
            }
        })
        .reduce((acc, total) => {
            return acc + total;
        }, 0));
};

export { marketHasBets, getPLForRunner };