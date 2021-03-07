import { ALL_PRICES } from '../ladder/CreateFullLadder';

export const calcTickOffsetPrice = (price, side, ticks, percent = false) => {
  price = Number(price);

  if (percent) {
    percent = Math.min(Math.max(0, ticks), 1000);
    const priceFromPercent = ((price * percent) / 100);
    const target = (side == 'BACK') ? price - priceFromPercent : price + priceFromPercent;

    return ALL_PRICES.reduce((a, b) => {
      const aDiff = Math.abs(a - target);
      const bDiff = Math.abs(b - target);

      if (aDiff == bDiff) {
        return a > b ? a : b;
      }
      return bDiff < aDiff ? b : a;
    });
  }

  const priceIndex = ALL_PRICES.indexOf(price);
  if (priceIndex === -1) return null;

  if (side == 'BACK') return ALL_PRICES[Math.max(0, priceIndex - ticks)];
  if (side == 'LAY') return ALL_PRICES[Math.min(1000, priceIndex + ticks)];

  return null;
};

export const checkTickOffsetTrigger = (tos, sizeMatched) => tos && sizeMatched / tos.size >= tos.percentageTrigger / 100;
