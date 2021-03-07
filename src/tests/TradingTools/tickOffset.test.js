import { calcTickOffsetPrice } from '../../utils/TradingStategy/TickOffset';

describe('Tick Offset initial calculated position based on ticks in settings', () => {
  it('Offset price 5 by 2 ticks', () => {
    expect(calcTickOffsetPrice(5, 'BACK', 2, false)).toEqual(4.8);
  });

  it('Offset price 4 by 10 ticks', () => {
    expect(calcTickOffsetPrice(4, 'BACK', 10, false)).toEqual(3.5);
  });

  it('Offset price 1.20 by 20 ticks, inbound price rounding', () => {
    expect(calcTickOffsetPrice(1.20, 'BACK', 20, false)).toEqual(1.01);
  });

  it('Offset price 1.20 by 20 ticks', () => {
    expect(calcTickOffsetPrice(1.20, 'LAY', 20, false)).toEqual(1.40);
  });

  it('Offset price 100 by 50 ticks', () => {
    expect(calcTickOffsetPrice(100, 'LAY', 50, false)).toEqual(600);
  });
});

describe('Tick Offset initial calculated position based on percentage in settings', () => {
  it('Offset price 5 by 50%', () => {
    expect(calcTickOffsetPrice(5, 'BACK', 50, true)).toEqual(2.5);
  });

  it('Offset price 5 by 100%', () => {
    expect(calcTickOffsetPrice(5, 'BACK', 100, true)).toEqual(1.01);
  });

  it('Offset price 1.44 by 10%', () => {
    expect(calcTickOffsetPrice(1.44, 'LAY', 10, true)).toEqual(1.58);
  });

  it('Offset price 1.78 by 5%', () => {
    expect(calcTickOffsetPrice(1.78, 'LAY', 5, true)).toEqual(1.87);
  });
});