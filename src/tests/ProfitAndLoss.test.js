import { getPLForRunner } from "../utils/Bets/GetProfitAndLoss";

describe('Profit and Loss should add back/lay bets, and return value', () => {
    const bets = {};

    bets.matched = [
      {
        marketId: "1.160741054",
        selectionId: 1212121,
        price: 4.4,
        side: "BACK",
        size: 2
      },
      {
        marketId: "1.160741054",
        selectionId: 2309518,
        price: 5.40,
        side: "BACK",
        size: 10
      },
      {
        marketId: "1.160741054",
        selectionId: 3525522,
        price: 7.00,
        side: "BACK",
        size: 5.98
      },
      {
        marketId: "1.160741054",
        selectionId: 3525522,
        price: 8.00,
        side: "LAY",
        size: 0.73
      },
      {
        marketId: "1.160741054",
        selectionId: 3525522,
        price: 8.00,
        side: "LAY",
        size: 4.50
      },
      {
        marketId: "1.160741054",
        selectionId: 4534636,
        price: 12.50,
        side: "BACK",
        size: 1.98
      },
      {
        marketId: "1.160741054",
        selectionId: 5682636,
        price: 14.50,
        side: "LAY",
        size: 0.74
      },
      {
        marketId: "1.160741054",
        selectionId: 5682636,
        price: 11.50,
        side: "BACK",
        size: 0.93
      }
  ];
  it("One back bet on this horse, with back/lay on other horses", () => {
    expect(getPLForRunner("1.160741054", 1212121, bets)).toEqual(-6.12);
  });
  it("One higher stake back bet on this horse, with back/lay on other horses", () => {
    expect(getPLForRunner("1.160741054", 2309518, bets)).toEqual(39.08);
  });
  it("Two lays and one back bet on this horse, and back/lay on other horses", () => {
    expect(getPLForRunner("1.160741054", 3525522, bets)).toEqual(-14.90);
  });
  it("One small back bet on this horse, and back/lay on other horses", () => {
    expect(getPLForRunner("1.160741054", 4534636, bets)).toEqual(9.83);
  });

  it("One small back and one small lay bet on this horse, and back/lay on other horses", () => {
    expect(getPLForRunner("1.160741054", 5682636, bets)).toEqual(-14.95);
  });

  it("No bets on this horse, and back/lay on other horses", () => {
    expect(getPLForRunner("1.160741054", null, bets)).toEqual(-14.92);
  });
});