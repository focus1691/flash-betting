import postData from './postData';

export const executeBet = async (bet) => {
  bet.size = parseFloat(bet.size).toFixed(2);
  const PlaceExecutionReport = await postData('/api/place-order', bet);

  if (!PlaceExecutionReport) return null;

  const { status, error, instructionReports } = PlaceExecutionReport;

  if (error || status === 'FAILURE' || !instructionReports) return null;

  const { orderStatus, sizeMatched, betId } = instructionReports[0];

  if (!betId) return null;

  const adjustedBet = { ...bet };
  adjustedBet.rfs = bet.customerStrategyRef;
  delete adjustedBet.customerStrategyRef;
  adjustedBet.betId = betId;
  adjustedBet.status = orderStatus;
  adjustedBet.sizeMatched = sizeMatched;
  adjustedBet.sizeRemaining = bet.size - sizeMatched;
  adjustedBet.strategy = 'None';

  return adjustedBet;
};

export const executeReduceSize = async (bet) => {
  const cancelOrder = await postData('/api/cancel-order', bet);
  return cancelOrder && cancelOrder.status === 'SUCCESS';
};

export const cancelBet = async (marketId, betId) => {
  await postData('/api/cancel-order', { marketId, betId });
};

export const cancelBets = (unmatchedBets, selectionId, side, price) => {
  const betIds = Object.keys(unmatchedBets);

  for (let i = 0; i < betIds.length; i += 1) {
    const betId = betIds[i];
    if (unmatchedBets[betId].selectionId === selectionId && (!side || side === unmatchedBets[betId].side) && (!price || price == unmatchedBets[betId].price)) {
      const { marketId } = unmatchedBets[betId];
      cancelBet(marketId, betId);
    }
  }
};

export const cancelMarketBets = (marketId, unmatchedBets) => {
  for (let i = 0; i < unmatchedBets.length; i += 1) {
    const { betId } = unmatchedBets[i];

    cancelBet(marketId, betId);
  }
};