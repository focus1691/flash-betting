import { marketHasBets, getPLForRunner, getLossForRunner } from '../../utils/Bets/GetProfitAndLoss';

function addBet(bets, marketId, selectionId, price, size, side) {
  bets.matched[selectionId] = { marketId, selectionId, price, size, side };
}

describe('Profit / Loss for a runner calculated from matched bets', () => {
  const marketId = '1.52252525';
  const selectionId = 23232;
  const bets = {
    matched: {
      1234: {
        marketId: '1.52252525',
        selectionId: 23232,
        price: '2.02',
        size: 10,
        side: 'BACK',
      },
    },
  };
  const bets2 = {
    matched: {},
  };

  it('A market with matched bets should show as the market having bets', () => {
    expect(marketHasBets(marketId, bets)).toBeTruthy();
    expect(marketHasBets(marketId, bets2)).toBeFalsy();
  });

  it('Return the correct profit for this selection from the bets placed in the market', () => {
    expect(getPLForRunner(marketId, selectionId, bets)).toEqual(10.20);

    addBet(bets, marketId, selectionId, '3.05', 25, 'BACK');

    expect(getPLForRunner(marketId, selectionId, bets)).toEqual(61.45);
  });
});
