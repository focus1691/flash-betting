import { calcLiability } from '../TradingStategy/HedingCalculator';

export default ((bet) => {
  console.log('calcPriceSize()', bet.size, bet.price);
  // bet.size = bet.side === 'LAY' ? calcLiability(bet.price, bet.size) : parseFloat(bet.size);
  bet.price = parseFloat(bet.price);
  return bet;
});
