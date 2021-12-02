export const isBetFairBet = (betId, bets) => {
  for (let i = 0; i < bets.length; i += 1) {
    if (bets[i].betId === betId) return true;
  }
  return false;
};
