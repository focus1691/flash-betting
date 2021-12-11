export default ((bets) => {
  if (bets) {
    return bets.reduce((acc, bet) => Number(acc + bet.size), 0);
  }
  return 0;
});
