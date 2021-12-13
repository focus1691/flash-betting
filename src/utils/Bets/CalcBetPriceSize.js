import { calcLiability } from '../TradingStategy/HedingCalculator';

export default ((bet) => {
  bet.size = bet.side === 'LAY' ? calcLiability(bet.price, bet.size).liability : parseFloat(bet.size);
  bet.price = parseFloat(bet.price);
  return bet;
});
