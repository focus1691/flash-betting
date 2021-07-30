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
  console.log('place order', bet);
  return async () => {
    bet = calcBetPriceSize(bet);
    if (isNaN(bet.size)) return null;

    if (parseFloat(bet.size) < 2.0) {
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
      const ReplaceExecutionReport = await postData('/api/replace-orders', {
        marketId: startingBet.marketId,
        betId: startingBet.betId,
        newPrice: bet.price,
      });

      if (ReplaceExecutionReport && ReplaceExecutionReport.status === 'SUCCESS') {
        if (ReplaceExecutionReport.instructionReports[0] && ReplaceExecutionReport.instructionReports[0].placeInstructionReport) {
          const { betId } = ReplaceExecutionReport.instructionReports[0].placeInstructionReport;
          return betId;
        }
      }
      return null;
    }
    const adjustedBet = await executeBet(bet);
    if (!adjustedBet) return null;
    return adjustedBet.betId;
  };
};

export const cancelBet = async (marketId, betId) => {
  await postData('/api/cancel-order', { marketId, betId });

  return async (dispatch) => {
    dispatch(removeUnmatchedBets({ betIds: [betId] }));
  };
};

export const cancelBets = (selectionId, side, unmatchedBets) => {
  const betIds = Object.keys(unmatchedBets);
  const cancelledBets = [];

  for (let i = 0; i < betIds.length; i += 1) {
    const betId = betIds[i];
    if (unmatchedBets[betId].selectionId === selectionId && (!side || side === unmatchedBets[betId].side)) {
      cancelledBets.push(betId);
      const { marketId } = unmatchedBets[betId];
      postData('/api/cancel-order', { marketId, betId });
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
