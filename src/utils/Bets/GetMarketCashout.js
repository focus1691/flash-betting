

import { calcBackProfit, twoDecimalPlaces } from "../PriceCalculator";

const getMarketCashout = (marketId, bets) => {
    return twoDecimalPlaces(Object.values(bets.matched)
        .filter(order => order.marketId === marketId)
        .map(order => calcBackProfit(order.size, parseFloat(order.price), order.side === "BACK" ? 0 : 1))
        .reduce((acc, total) => acc + total));
};

export { getMarketCashout };