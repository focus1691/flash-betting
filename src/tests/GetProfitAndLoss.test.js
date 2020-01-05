import { getPLForRunner } from "../utils/Bets/GetProfitAndLoss";

describe('The Profit & Loss for a runner', () => {
    const bets = {};

    bets.matched = [
        {
            marketId: "1.160741054",
            selectionId: 1,
            price: 2.26,
            side: "LAY",
            size: 2
        }
    ];

    it("Liability should be correct", () => {

        expect(getPLForRunner("1.160741054", 1, bets)).toBe(-2.52);

    });
});