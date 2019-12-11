

import { twoDecimalPlaces } from "../Bets/BettingCalculations";
import { calcHedgedPL2 } from "../TradingStategy/HedingCalculator";

const getMarketCashout = (marketId, bets, ladder) => {

    const reducer = (acc, cur) => acc.indexOf(cur.selectionId) === -1 ? acc.concat(cur.selectionId) : acc; 
    const selections = Object.values(bets.matched).reduce(reducer, []);

    return twoDecimalPlaces(selections.map(selection =>
        Object.values(bets.matched).filter(bet => bet.selectionId === selection && bet.marketId === marketId && ladder[bet.selectionId])
        .map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(ladder[bet.selectionId].ltp[0]) ))
        .reduce((acc, tot) => acc + tot, 0))
        .reduce((acc, tot) => acc + tot, 0));
};

export { getMarketCashout };