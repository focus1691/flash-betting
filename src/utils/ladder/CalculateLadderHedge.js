import { calcHedgedPL2 } from "../TradingStategy/HedingCalculator";
import { calcBackProfit } from "../Bets/BettingCalculations";

/**
 * This function calculates a hedge column in the ladder 
 * @param {number} odds - The odds we are calculating for
 * @param {number} ladderUnmatched - The setting that is associated with what happens to the columns (hedged, pl, none)
 * @param {number} stake - The current stake value that is selected, [2, 4, 6, 8, 10] <- default 2
 * @param {number} pl - The current profit/loss of the ladder
 * @return {object} side, profit  
 */
export default (odds, selectionMatchedBets, ladderUnmatched, stake, pl) => {

    if (selectionMatchedBets !== undefined && ladderUnmatched === "hedged") {
        // calculate the profit based on the current row (the odds decide this)
        const profitArray = selectionMatchedBets.map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(odds)));
        
        // combine this all, this will be the white space
        const profit = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);

        // find which side the column is supposed to be on
        const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) <= 0 ? "BACK" : "LAY"

        return { side, profit }
    }

    if (ladderUnmatched === "pl") {
        return { side: "BACK", profit: parseFloat(calcBackProfit(parseFloat(stake), odds, 0)) + parseFloat(pl) } 
    }

    return undefined
    
}