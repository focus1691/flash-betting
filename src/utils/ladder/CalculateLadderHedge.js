import { calcHedgedPL2 } from "../TradingStategy/HedingCalculator";
import { calcBackProfit } from "../Bets/BettingCalculations";

/**
 * This function calculates the hedge columns in the ladder as well as what would be the hedge for the LTP
 * @param {object} ladder - The Ladder List
 * @param {number} id - The id associated with the ladder
 * @param {number} ladderUnmatched - The setting that is associated with what happens to the columns (hedged, pl, none)
 * @param {number} stake - The current stake value that is selected, [2, 4, 6, 8, 10] <- default 2
 * @param {number} pl - The current profit/loss of the ladder
 * @return {object} fullLadderWithProfit, ladderLTPHedge 
 */
export default (ladder, id, selectionMatchedBets, ladderUnmatched, stake, pl) => {
    const fullLadderWithProfit = {};
    let ladderLTPHedge = 0;

    Object.values(ladder[id].fullLadder).map(item => {
        fullLadderWithProfit[item.odds] = { ...item }

        if (selectionMatchedBets !== undefined && ladderUnmatched === "hedged") {
            // calculate the profit based on the current row (the odds decide this)
            const profitArray = selectionMatchedBets.map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(item.odds)));
            
            // combine this all, this will be the white space
            const profit = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);

            // if the row is the ltp, we set the ladder LTP
            if (parseFloat(item.odds).toFixed(2) == parseFloat(ladder[id].ltp[0]).toFixed(2)) {
                ladderLTPHedge = profit;
            }

            // find which side the column is supposed to be on
            const side = selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) <= 0 ? "BACK" : "LAY"
            fullLadderWithProfit[item.odds][side == "BACK" ? 'backProfit' : "layProfit"] = profit
        }

        if (ladderUnmatched === "pl") {
            fullLadderWithProfit[item.odds]['backProfit'] = parseFloat(calcBackProfit(parseFloat(stake), item.odds, 0)) + parseFloat(pl);
        }
    });

    return { fullLadderWithProfit, ladderLTPHedge }
}