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
        }
    ];

    it("One back bet on this horse, with back/lay on other horses", () => {
        expect(Hedging.getHedgedBetsToMake("1.160741054", bets, 1.82)).toMatchObject(
            [{
                buyPrice: 1.82,
                stake: 12.91,
                side: "LAY"
            }]
        )
    });
});