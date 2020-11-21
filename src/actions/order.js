/* eslint-disable consistent-return */
import { calcLayBet } from '../utils/TradingStategy/HedingCalculator';
import { saveBet, removeBet } from '../http/helper';
import removeBackBet from "./back";
import removeLayBet from "./lay";
import removeStopEntryBet from './stopEntry';
import removeTickOffset from './tickOffset';
import removeStopLoss from './stopLoss';

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

export const updateSizeMatched = (data) => ({
  type: 'UPDATE_SIZE_MATCHED',
  payload: data,
});

export const setBetExecutionComplete = (data) => ({
  type: 'SET_BET_EXECUTION_COMPLETE',
  payload: data,
});

export const placeOrder = async (bet) => {
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
            dispatch(addMatchedBet({
              ...startingBet,
              sizeMatched,
              sizeRemaining: 0,
            }));
          }
          else if (orderStatus === 'EXECUTABLE') {
            dispatch(addUnmatchedBet({
              ...startingBet,
              sizeMatched,
              sizeRemaining: bet.size - sizeMatched,
            }))
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

export const executeBet = async (bet) => {
  bet.size = parseFloat(bet.size).toFixed(2);

  const PlaceExecutionReport = await fetch('/api/place-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  })
  .then((res) => res.json())
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

export const executeCancelBet = (order) => new Promise(async (res, rej) => {
  await fetch('/api/cancel-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(order),
  })
    .then((data) => res(data.json()))
    .catch((err) => rej(err));
});
2
export const cancelOrders = (orders, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side) => {
  return async (dispatch) => {

    const cancelSpecialOrder = (bet) => {
      if (side && side != bet.side) return;
      switch (bet.strategy) {
        case 'Back':
          dispatch(removeBackBet({ rfs: bet.rfs, selectionId: bet.selectionId }));
          break;
        case 'Lay':
          dispatch(removeLayBet({ rfs: bet.rfs, selectionId: bet.selectionId }));
          break;
        case 'Stop Entry':
          dispatch(removeStopEntryBet({ rfs: bet.rfs, selectionId: bet.selectionId }));
          break;
        case 'Tick Offset':
          dispatch(removeTickOffset({ rfs: bet.rfs }));
          break;
        case 'Stop Loss':
          dispatch(removeStopLoss({ selectionId: bet.rfs }));
          break;
        default:
          // if (fillOrKillList[bet.betId]) delete newFillOrKill[bet.betId];
          executeCancelBet(bet);
          break;
      }
      removeBet({ rfs: bet.rfs });
    };

    if (Array.isArray(orders)) {
      for (let i = 0; i < orders.length; i += 1) {
        cancelSpecialOrder(orders[i]);
      }
    } else if (orders.hasOwnProperty('betId') || orders.hasOwnProperty('rfs')) {
      cancelSpecialOrder(orders);
    } else {
      Object.values(orders).forEach((rfs) => {
        rfs.forEach((orders) => {
          cancelSpecialOrder(orders);
        });
      });
    }
  };
};

/**
 ** Wrapper function to check order and dispatch delete
 * @param {object} order Object to delete
 */
export const cancelOrder = (order) => {
  if (!order.unmatchedBets || !order.matchedBets) {
    return;
  }

  return async (dispatch) => {
    // order with everything removed that might make the payload too large
    const minimalOrder = {};
    Object.keys(order).map((key) => {
      if (key !== 'unmatchedBets' && key !== 'matchedBets' && key !== 'callback') {
        minimalOrder[key] = order[key];
      }
    });
    const cancelOrder = await executeCancelBet(minimalOrder);

    if (cancelOrder) {
      const newUnmatchedBets = Object.keys(order.unmatchedBets).filter((key) => {
        if (key != order.betId) return order.unmatchedBets[key];
      });
      dispatch(
        updateOrders({
          unmatched: newUnmatchedBets,
          matched: order.matchedBets || {},
        }),
      );
    } else {
      dispatch(
        updateOrders({
          unmatched: order.unmatchedBets || {},
          matched: order.matchedBets || {},
        }),
      );
    }
  };
};

/**
 * This function saves the new stop loss to the database
 * @param {*} stopLoss New stop loss
 * @param {*} stopLossList List of stop loss objects
 * @returns Updated list to be updated in the redux store
 */
export const placeStopLoss = async (stopLoss, stopLossList) => {
  const newStopLossList = { ...stopLossList };
  newStopLossList[stopLoss.selectionId] = stopLoss;

  saveBet(stopLoss);

  return newStopLossList;
};

/**
 * This function saves the new tick offset to the database
 * @param {object} tickOffset New tick offset
 * @param {object} tickOffsetList List of tick offset objects
 * @returns Updated list to be updated in the redux store
 */
export const placeTickOffset = async (tickOffset, tickOffsetList) => {
  const newTickOffsetList = { ...tickOffsetList };
  newTickOffsetList[tickOffset.rfs] = tickOffset;

  saveBet(tickOffset);

  return newTickOffsetList;
};

/**
 * This function saves the fill or kill order to the database
 * @param {object} tickOffset New Fill or Kill
 * @param {object} tickOffsetList List of Fill or Kill objects
 * @returns Updated list to be updated in the redux store
 */
export const placeFillOrKill = async (fillOrKill, fillOrKillList) => {
  const newFillOrKillList = { ...fillOrKillList };
  newFillOrKillList[fillOrKill.betId] = fillOrKill;

  saveBet(fillOrKill);

  return newFillOrKillList;
};

export const replaceStopLoss = async (SL, stopLossList, data) => {
  const newStopLossList = { ...stopLossList };

  //* Just remove it if the stop loss position is clicked
  if (SL && SL.stopLoss) {
    removeBet(newStopLossList[data.selectionId]);

    delete newStopLossList[data.selectionId];

    return newStopLossList;
    //* Otherwise update the stop position
  } if (stopLossList) {
    const newStopLoss = { ...newStopLossList[data.selectionId] };
    removeBet(newStopLoss);

    //! Update the stop loss
    newStopLoss.size = data.stakeVal;
    newStopLoss.price = data.price;
    newStopLoss.units = data.stopLossUnits;
    newStopLoss.custom = true;
    newStopLoss.assignedIsOrderMatched = false;
    newStopLoss.strategy = 'Stop Loss';
    newStopLoss.tickOffset = 0;
    newStopLoss.hedged = data.stopLossHedged;

    newStopLossList[data.selectionId] = newStopLoss;

    saveBet(newStopLoss);

    return newStopLossList;
  }
  return {};
};
