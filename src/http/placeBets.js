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