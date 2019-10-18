import * as Hedging from "../utils/TradingStategy/HedingCalculator";

describe('Market Cashout is used to hedge on all selections that can be hedged on the opposite side', () => {
    const bets = {};

    bets.matched = [
        {
            marketId: "1.160741054",
            selectionId: 1,
            price: 1.75,
            side: "BACK",
            size: 10
        },
        {
            marketId: "1.160741054",
            selectionId: 1,
            price: 1.76,
            side: "BACK",
            size: 3.40
        },
        {
            marketId: "1.160741054",
            selectionId: 2,
            price: 9.60,
            side: "BACK",
            size: 8.00
        },
        {
            marketId: "1.160741054",
            selectionId: 2,
            price: 9.60,
            side: "BACK",
            size: 5.99
        }
    ];

    it("Two bets backing the same horse at different prices/stakes, and another two bets on a different horse. Find the hedge stake to LAY on this selection", () => {
        expect(Hedging.getHedgedBetsToMake("1.160741054", bets, {1: 1.82, 2: 10.50})).toMatchObject(
            [
                {
                    buyPrice: 1.82,
                    stake: 12.91,
                    side: "LAY"
                },
                {
                    buyPrice: 10.5,
                    stake: 12.79,
                    side: "LAY",
                    selectionId: 2
                }
            ]
        )
    });
});