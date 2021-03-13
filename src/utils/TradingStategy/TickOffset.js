import { ALL_PRICES } from '../Bets/PriceCalculations';

export const calcTickOffsetPrice = (price, side, ticks, percent = false) => {
  price = Number(price);
  side = side.toUpperCase();

  if (percent) {
    percent = Math.min(Math.max(0, ticks), 1000);
    const priceFromPercent = ((price * percent) / 100);
    const target = (side === 'BACK') ? price - priceFromPercent : price + priceFromPercent;

    return ALL_PRICES.reduce((a, b) => {
      const aDiff = Math.abs(a - target);
      const bDiff = Math.abs(b - target);

      if (aDiff == bDiff) {
        return a > b ? a : b;
      }
      return bDiff < aDiff ? b : a;
    });
  }

  ticks = side === 'BACK' ? -ticks : +ticks; // Add for back, subtract for lay
  let indexToStop = ALL_PRICES.indexOf(price) + ticks; // Price index
  indexToStop = Math.min(Math.max(0, indexToStop), ALL_PRICES.length - 1); // Must be between 1.01 - 1000
  return ALL_PRICES[indexToStop];
};

export const checkTickOffsetTrigger = (tos, sizeMatched) => tos && sizeMatched / tos.size >= tos.percentageTrigger / 100;
