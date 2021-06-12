import calcBetPriceSize from '../../utils/Bets/CalcBetPriceSize';
import postData from '../../http/postData';
import { executeBet, executeReduceSize } from '../../http/placeBets';

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

export const placeOrder = (bet) => {
  return async (dispatch) => {
    bet = calcBetPriceSize(bet);
    if (isNaN(bet.size)) return null;

    if (parseFloat(bet.size) < 2.0) {
      //! Yield call()
      const startingBet = await executeBet({
        ...bet,
        price: bet.side === 'BACK' ? 1000 : 1.01,
        size: 2,
      });
      if (!startingBet) return null;

      //! Yield call()
      // cancel part of the first one
      await executeReduceSize({
        marketId: startingBet.marketId,
        betId: startingBet.betId,
        sizeReduction: parseFloat((2 - startingBet.size).toFixed(2)),
      });

      // replaceOrder, editing the price
      const ReplaceExecutionReport = await postData('/api/replace-orders', {
        marketId: startingBet.marketId,
        betId: startingBet.betId,
        newPrice: bet.price,
      });

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
    } else {
      //! Saga call()
      const adjustedBet = await executeBet(bet);
      if (!adjustedBet) return null;
      return adjustedBet.betId;
    }
  };
};

export const cancelBet = async (marketId, betId) => {
  await postData('/api/cancel-order', { marketId, betId });

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
      postData('/api/cancel-order', {
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
    postData('/api/cancel-order', {
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
