import { stopLossCheck } from '../utils/ExchangeStreaming/MCMHelper';
import { findStopPosition } from '../utils/TradingStategy/StopLoss';

test('Stop loss 3 ticks BACK HIT', async () => {
  expect(findStopPosition('150', '180', 3, 'BACK')).toEqual({
    targetMet: true,
    stopPrice: '180.00',
  });
});

describe('check if stoploss works', () => {
  test('no order attached to it: rfs == undefined', () => {
    const stopLossList = {
      237470: {
        strategy: 'Stop Loss',
        trailing: true,
        hedged: false,
        assignedIsOrderMatched: false,
        units: 'Ticks',
        _id: '5d96d43809bd2142c4321f37',
        marketId: '1.159700186',
        selectionId: 237470,
        side: 'LAY',
        size: 5,
        price: '38',
        rfs: undefined,
        betId: '4235115',
        ticks: 5,
      },
    };

    expect(stopLossCheck(stopLossList[237470], 26)).toBeTruthy();
  });

  test('order attached to it: rfs == 3423423fedjafi', () => {
    const stopLossList = {
      237470: {
        strategy: 'Stop Loss',
        trailing: true,
        hedged: false,
        assignedIsOrderMatched: true,
        units: 'Ticks',
        _id: '5d96d43809bd2142c4321f37',
        marketId: '1.159700186',
        selectionId: 237470,
        side: 'BACK',
        size: 5,
        price: '38',
        rfs: '3423423fedjafi',
        betId: '4235115',
        ticks: 5,
      },
    };
    expect(stopLossCheck(stopLossList[237470], '35')).toEqual({
      targetMet: false,
    });
  });

  test('back bet 0.01 @ 5.3', () => {
    const stopLossList = {
      237470: {
        strategy: 'Stop Loss',
        trailing: true,
        hedged: false,
        assignedIsOrderMatched: true,
        units: 'Ticks',
        _id: '5d96d43809bd2142c4321f37',
        marketId: '1.159700186',
        selectionId: 237470,
        side: 'BACK',
        size: 0.01,
        price: '5.3',
        rfs: '3423423fedjafi',
        betId: '4235115',
        ticks: 2,
      },
    };
    expect(stopLossCheck(stopLossList[237470], '6')).toEqual({
      targetMet: true,
      stopPrice: '5.50',
    });
  });
});
