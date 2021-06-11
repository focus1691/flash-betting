import { calcLayBet } from '../TradingStategy/HedingCalculator';

export default ((bet) => {
  bet.size = bet.side === 'LAY' ? calcLayBet(bet.price, bet.size).liability : parseFloat(bet.size);
  bet.price = parseFloat(bet.price);
  return bet;
});
