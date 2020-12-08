import { calcLayBet } from '../utils/TradingStategy/HedingCalculator';

export const updateOrders = (order) => ({
  type: 'UPDATE_BET',
  payload: order,
});

export const addMatchedBet = (bet) => ({
  type: 'ADD_MATCHED_BET',
  payload: bet,
});

export const addUnmatchedBet = (bet) => ({
  type: 'ADD_UNMATCHED_BET',
  payload: bet,
});

export const removeUnmatchedBet = (bet) => ({
  type: 'REMOVE_UNMATCHED_BET',
  payload: bet,
});

export const removeUnmatchedBets = (bets) => ({
  type: 'REMOVE_UNMATCHED_BETS',
  payload: bets,
});

export const updateSizeMatched = (data) => ({
  type: 'UPDATE_SIZE_MATCHED',
  payload: data,
});

export const setBetExecutionComplete = (data) => ({
  type: 'SET_BET_EXECUTION_COMPLETE',
  payload: data,
});

export const executeBet = async (bet) => {
  bet.size = parseFloat(bet.size).toFixed(2);
  const PlaceExecutionReport = await fetch('/api/place-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  }).then((res) => res.json());
  if (!PlaceExecutionReport || PlaceExecutionReport.status === 'FAILURE') return null;

  const { orderStatus, sizeMatched, betId } = PlaceExecutionReport.instructionReports[0];

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
  const cancelOrder = await fetch('/api/cancel-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  })
    .then((res) => res.json())
    .catch(() => false);

  return cancelOrder && cancelOrder.status === 'SUCCESS';
};

export const placeOrder = (bet) => {
  bet.size = bet.side === 'LAY' ? calcLayBet(bet.price, bet.size).liability : parseFloat(bet.size);
  bet.price = parseFloat(bet.price);

  if (isNaN(bet.size)) return null;

  if (parseFloat(bet.size) < 2.0) {
    return async (dispatch) => {
      const startingBet = await executeBet({
        ...bet,
        price: bet.side === 'BACK' ? 1000 : 1.01,
        size: 2,
      });
      if (!startingBet) return null;

      // cancel part of the first one
      await executeReduceSize({
        marketId: startingBet.marketId,
        betId: startingBet.betId,
        sizeReduction: parseFloat((2 - startingBet.size).toFixed(2)),
      });

      // replaceOrder, editing the price
      const ReplaceExecutionReport = await fetch('/api/replace-orders', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          marketId: startingBet.marketId,
          betId: startingBet.betId,
          newPrice: bet.price,
        }),
      }).then((res) => res.json());

      if (ReplaceExecutionReport && ReplaceExecutionReport.status === 'SUCCESS') {
        if (ReplaceExecutionReport.instructionReports[0] && ReplaceExecutionReport.instructionReports[0].placeInstructionReport) {
          const { betId, orderStatus, sizeMatched } = ReplaceExecutionReport.instructionReports[0].placeInstructionReport;

          startingBet.betId = betId;

          if (orderStatus === 'EXECUTION_COMPLETE') {
            dispatch(
              addMatchedBet({
                ...startingBet,
                sizeMatched,
                sizeRemaining: 0,
              }),
            );
          } else if (orderStatus === 'EXECUTABLE') {
            dispatch(
              addUnmatchedBet({
                ...startingBet,
                sizeMatched,
                sizeRemaining: bet.size - sizeMatched,
              }),
            );
          }
        }
        return startingBet.betId;
      }
    };
  }

  return async (dispatch) => {
    const adjustedBet = await executeBet(bet);
    if (!adjustedBet) return null;
    if (adjustedBet.status === 'EXECUTION_COMPLETE') dispatch(addMatchedBet(adjustedBet));
    else if (adjustedBet.status === 'EXECUTABLE') dispatch(addUnmatchedBet(adjustedBet));

    return adjustedBet.betId;
  };
};

export const executeCancelBet = async (bet) => {
  await fetch('/api/cancel-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  });
};

export const cancelBet = async (marketId, betId) => {
  await executeCancelBet({ marketId, betId });

  return async (dispatch) => {
    dispatch(removeUnmatchedBets({ betId }));
  };
};

export const cancelBets = (selectionId, side, unmatchedBets) => {
  const betIds = Object.keys(unmatchedBets);
  const cancelledBets = [];

  for (let i = 0; i < unmatchedBets.length; i += 1) {
    if (unmatchedBets[betIds[i]].selectionId === selectionId && (!side || side === unmatchedBets[betIds[i]].side)) {
      cancelledBets.push(betIds[i]);
      executeCancelBet({
        marketId: unmatchedBets[betIds[i]].marketId,
        betId: unmatchedBets[betIds[i]].betId,
      });
    }
  }

  return async (dispatch) => {
    dispatch(removeUnmatchedBets({ betIds: cancelledBets }));
  };
};

export const cancelMarketBets = (marketId, unmatchedBets) => {
  const cancelledBets = [];

  for (let i = 0; i < unmatchedBets.length; i += 1) {

    cancelledBets.push(unmatchedBets[i].betId);
    executeCancelBet({
      marketId: unmatchedBets[i].marketId,
      betId: unmatchedBets[i].betId,
    });
  }

  return async (dispatch) => {
    dispatch(removeUnmatchedBets({ betIds: cancelledBets }));
  };
};

export const updateBetPrice = (data) => ({
  type: 'UPDATE_BET_PRICE',
  payload: data,
});
