import { ALL_PRICES } from '../Bets/PriceCalculations';
import CalculateLadderHedge from '../ladder/CalculateLadderHedge';
import { removeBet, updateTicks } from '../../http/dbHelper';

export const calcStopLossPrice = (price, ticks, side, percent = false) => {
  price = Number(price);
  side = side.toUpperCase();

  if (percent) {
    percent = Math.min(Math.max(0, ticks), 1000);
    const priceFromPercent = (price * percent) / 100;
    const target = side === 'BACK' ? price + priceFromPercent : price - priceFromPercent;

    return ALL_PRICES.reduce((a, b) => {
      const aDiff = Math.abs(a - target);
      const bDiff = Math.abs(b - target);

      if (aDiff == bDiff) {
        return a > b ? a : b;
      }
      return bDiff < aDiff ? b : a;
    });
  }

  ticks = side === 'BACK' ? +ticks : -ticks; // Add for back, subtract for lay
  let indexToStop = ALL_PRICES.indexOf(price) + ticks; // Price index
  indexToStop = Math.min(Math.max(0, indexToStop), ALL_PRICES.length - 1); // Must be between 1.01 - 1000
  return ALL_PRICES[indexToStop];
};

export const checkStopLossHit = ({ price, side }, LTP) => {
  price = Number(price);
  LTP = Number(LTP);

  return (side === 'BACK' && LTP <= price) || (side === 'LAY' && LTP >= price);
};

export const isStopLossTriggered = (SL, rfs, sizeRemaining) => SL && !SL.assignedIsOrderMatched && SL.rfs == rfs && sizeRemaining == 0;

export const checkAndExecuteStopLoss = (stopLoss, currentLTP, ltp, matchedBets, placeOrder, removeStopLoss, updateStopLossTicks) => {
  if (!stopLoss) return;

  const { rfs, marketId, selectionId, side, price, trailing } = stopLoss;

  const prevLTP = ltp[1] || ltp[0];

  const targetMet = checkStopLossHit(stopLoss, currentLTP);

  if (targetMet) {
    const newMatchedBets = Object.values(matchedBets).filter((bet) => bet.selectionId == selectionId);
    const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

    // Calculate the hedged size for the price
    const { size } = CalculateLadderHedge(parseFloat(price), newMatchedBets, 'hedged');

    placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef });
    removeStopLoss({ selectionId }); // Remove the SL
    removeBet({ rfs }); // Remove the SL from DB
  } else if (trailing && ((currentLTP < prevLTP && side == 'BACK') || (currentLTP > prevLTP && side == 'LAY'))) {
    stopLoss.ticks += 1;
    updateTicks(stopLoss); //! Update SQLite with new ticks
    updateStopLossTicks({ selectionId, ticks: stopLoss.ticks });
  }
};
