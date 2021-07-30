import { cancelBet } from '../../http/placeBets';

export const isFOKReady = (FOK) => {
  return (FOK && Date.now() / 1000 - FOK.startTime / 1000 >= FOK.seconds);
};

export const checkFOKBetsAndExecute = (list, removeFOK, updateCustomOrder, dispatch) => {
  const bets = Object.values(list);

  for (let i = 0; i < bets.length; i += 1) {
    const FOK = bets[i];
    if (isFOKReady(FOK)) {
      const { marketId, betId, rfs } = FOK;
      cancelBet(marketId, betId); // BetFair
      dispatch(removeFOK({ betId })); // FOK Action
      updateCustomOrder('remove-bet', { rfs }); // DB
    }
  }
};
