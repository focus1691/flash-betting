

export const isFOKReady = (FOK) => {
  return (FOK && Date.now() / 1000 - FOK.startTime / 1000 >= FOK.seconds);
};

export const checkFOKBetsAndExecute = (list, cancelBet, removeFOK, removeBet) => {
  const bets = Object.values(list);

  for (let i = 0; i < bets.length; i += 1) {
    const FOK = bets[i];
    if (isFOKReady(FOK)) {
      cancelBet(FOK.marketId, FOK.betId); // BetFair
      removeFOK({ betId: FOK.betId }); // FOK Action
      removeBet({ rfs: FOK.rfs }); // DB
    }
  }
};
