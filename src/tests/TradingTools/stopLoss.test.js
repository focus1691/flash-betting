import { calcStopLossPrice } from '../../utils/TradingStategy/StopLoss';

describe('Calculate the stop price based on the bet price / ticks selected', () => {
  it('Stop Loss 2 ticks BACK @ 2.02', () => {
    expect(calcStopLossPrice(2.02, 2, 'BACK')).toEqual(2.06);
  });

  it('Stop Loss 29 ticks BACK @ 100', () => {
    expect(calcStopLossPrice(100, 29, 'BACK')).toEqual(390);
  });

  it('Stop Loss 5 ticks LAY @ 1.51', () => {
    expect(calcStopLossPrice(1.51, 5, 'Lay')).toEqual(1.46);
  });

  it('Stop Loss 15 ticks LAY @ 1.30', () => {
    expect(calcStopLossPrice(1.30, 15, 'Lay')).toEqual(1.15);
  });

  it('Stop Loss 15 ticks LAY @ 1.11', () => {
    expect(calcStopLossPrice(1.11, 15, 'Lay')).toEqual(1.01);
  });

  it('Stop Loss 3 ticks BACK @ 980', () => {
    expect(calcStopLossPrice(980, 3, 'BACK')).toEqual(1000);
  });
});

describe('Calculate the stop loss positions with bad input', () => {
  it('String as price / ticks, 2 ticks BACK @ 2.02', () => {
    expect(calcStopLossPrice('2.02', '2', 'BACK')).toEqual(2.06);
  });

  it('String as price / ticks, 29 ticks BACK @ 100', () => {
    expect(calcStopLossPrice('100', '29', 'BACK')).toEqual(390);
  });
});