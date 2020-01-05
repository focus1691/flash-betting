import { getPLForRunner } from "../utils/Bets/GetProfitAndLoss";
import { calcHedgedPL2 } from "../utils/TradingStategy/HedingCalculator";
import CalculateLadderHedge from "../utils/ladder/CalculateLadderHedge";

describe('The LTP Hedge for a Runner', () => {
    const bets = {};

    bets.matched = [
        {
            marketId: "1.160741054",
            selectionId: 1,
            price: 2.26,
            side: "LAY",
            size: 2
        },
        {
            marketId: "1.160741054",
            selectionId: 1,
            price: 2.24,
            side: "BACK",
            size: 2
        },
        
    ];

    const selectionMatchedBets = Object.values(bets.matched).filter(bet => parseFloat(bet.selectionId) === parseFloat(1));

    const PL = getPLForRunner("1.160741054", parseInt(1), { matched: bets.matched }).toFixed(2)

    // calculate ladder ltp hedge
    const profitArray = selectionMatchedBets.map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(3.50)));
    const ladderLTPHedge = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);

    // calculates the Hedge based on the 
    const PLHedgeNumber = selectionMatchedBets.length > 0 ? CalculateLadderHedge(2.26, selectionMatchedBets, "hedged") : undefined; 

    it("Hedge figure should be correct", () => {

        expect(PLHedgeNumber.profit).toBe("-0.02");

    });
    it("Hedge Size should be correct", () => {

        expect(PLHedgeNumber.size).toBe(0.02);

    });

    
});