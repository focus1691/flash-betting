/* eslint-disable consistent-return */
import { calcLayBet } from '../utils/TradingStategy/HedingCalculator';
import { saveBet, removeBet } from '../http/helper';

export const updateOrders = (order) => ({
  type: 'UPDATE_BET',
  payload: order,
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

export const placeOrder = (order) => {
  order.size = order.side === 'LAY' ? calcLayBet(order.price, order.size).liability : parseFloat(order.size);
  order.price = parseFloat(order.price);

  if (!order.unmatchedBets || !order.matchedBets || isNaN(order.size)) return;

  if (parseFloat(order.size) < 2.0) {
    return async (dispatch) => {
      const startingOrder = await placeOrderAction({
        ...order, price: order.side === 'BACK' ? 1000 : 1.01, size: 2, orderCompleteCallBack: undefined,
      });
      if (startingOrder === null) return;

      await dispatch(updateOrders(startingOrder.bets));

      // cancel part of the first one
      const reducedOrderBets = await reduceSizeAction(
        {
          ...startingOrder.order,
          unmatchedBets: startingOrder.bets.unmatched,
          matchedBets: startingOrder.bets.matched,
          sizeReduction: parseFloat((2 - order.size).toFixed(2)),
        },
      );

      await dispatch(updateOrders(reducedOrderBets));

      // replaceOrder, editing the price
      const replaceOrderRequest = await fetch('/api/replace-orders', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          marketId: startingOrder.order.marketId,
          betId: startingOrder.order.betId,
          newPrice: order.price,
          customerStrategyRef: order.customerStrategyRef,
        }),
      }).then((res) => res.json());

      if (replaceOrderRequest.status === 'SUCCESS') {
        const newUnmatchedBets = { ...reducedOrderBets.unmatched };
        newUnmatchedBets[startingOrder.order.betId].price = order.price;
        delete newUnmatchedBets[startingOrder.order.betId].unmatchedBets;
        delete newUnmatchedBets[startingOrder.order.betId].matchedBets;

        if (order.orderCompleteCallBack) await order.orderCompleteCallBack(startingOrder.order.betId, newUnmatchedBets);

        return dispatch(
          updateOrders({
            unmatched: newUnmatchedBets,
            matched: startingOrder.bets.matched,
          }),
        );
      }
      // eslint-disable-next-line consistent-return
      return dispatch(
        updateOrders({
          unmatched: startingOrder.bets.unmatched,
          matched: startingOrder.bets.matched,
        }),
      );
    };
  }

  return async (dispatch) => {
    const result = await placeOrderAction(order);
    return result;
  };
};

export const placeOrderAction = async (order) => {
  //! order without anything that might make the payload too large
  const minimalOrder = {};

  Object.keys(order).forEach((key) => {
    if (key !== 'unmatchedBets' && key !== 'matchedBets' && key !== 'orderCompleteCallBack') {
      minimalOrder[key] = order[key];
    }
  });

  minimalOrder.size = parseFloat(minimalOrder.size).toFixed(2);

  return fetch('/api/place-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(minimalOrder),
  })
    .then((res) => res.json())
    .then(async (result) => {
      if (!result || result.status === 'FAILURE') return null;

      const { betId } = result.instructionReports[0];

      const adjustedOrder = { ...minimalOrder };
      adjustedOrder.rfs = order.customerStrategyRef;
      adjustedOrder.betId = betId;
      adjustedOrder.strategy = 'None';

      if (betId === undefined) {
        return;
      }

      const newUnmatchedBets = { ...order.unmatchedBets };
      newUnmatchedBets[betId] = adjustedOrder;

      const newBets = {
        unmatched: newUnmatchedBets,
        matched: order.matchedBets == undefined ? {} : order.matchedBets,
      };

      if (order.orderCompleteCallBack !== undefined) await order.orderCompleteCallBack(betId, newUnmatchedBets);

      return { order: adjustedOrder, bets: newBets };
    });
};

export const cancelOrders = async (orders, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side) => {
  const newBackList = { ...backList };
  const newLayList = { ...layList };
  const newStopEntryList = { ...stopEntryList };
  const newTickOffsetList = { ...tickOffsetList };
  const newStopLossList = { ...stopLossList };
  const newFillOrKill = { ...fillOrKillList };

  const cancelSpecialOrder = async (order) => {
    //! Run only if side is undefined or side matches order
    if (!side || side === order.side) {
      //! figure out which strategy it's using and make a new array without it
      switch (order.strategy) {
        case 'Back':
          const backIdx = newBackList[order.selectionId].findIndex((v) => v.rfs === order.rfs);
          if (backIdx > -1) {
            removeBet(newBackList[order.selectionId][backIdx]);
            newBackList[order.selectionId].splice(backIdx, 1);
          }
          break;
        case 'Lay':
          const layIdx = newLayList[order.selectionId].findIndex((v) => v.rfs === order.rfs);
          if (layIdx > -1) {
            removeBet(newLayList[order.selectionId][layIdx]);
            newLayList[order.selectionId].splice(layIdx, 1);
          }
          break;
        case 'Stop Entry':
          const seIdx = newStopEntryList[order.selectionId].findIndex((v) => v.rfs === order.rfs);
          if (seIdx > -1) {
            removeBet(newStopEntryList[order.selectionId][seIdx]);
            newStopEntryList[order.selectionId].splice(seIdx, 1);
          }
          break;
        case 'Tick Offset':
          removeBet(newTickOffsetList[order.rfs]);
          delete newTickOffsetList[order.rfs];
          break;
        case 'Stop Loss':
          removeBet(newStopLossList[order.selectionId]);
          delete newStopLossList[order.selectionId];
          break;
        default:
          // if we can find something that fits with the fill or kill, we can remove that (this is because we don't make another row for fill or kill)
          if (fillOrKillList[order.betId]) delete newFillOrKill[order.betId];
          await cancelBetFairOrder(order);
          break;
      }
    }
  };

  if (Array.isArray(orders)) {
    for (let i = 0; i < orders.length; i++) {
      cancelSpecialOrder(orders[i]);
    }
  } else if (orders.hasOwnProperty('betId') || orders.hasOwnProperty('rfs')) {
    await cancelSpecialOrder(orders);
  } else {
    await Object.values(orders).forEach((rfs) => {
      rfs.forEach((orders) => {
        cancelSpecialOrder(orders);
      });
    });
  }

  return {
    back: newBackList,
    lay: newLayList,
    stopLoss: newStopLossList,
    stopEntry: newStopEntryList,
    tickOffset: newTickOffsetList,
    fillOrKill: newFillOrKill,
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
    const cancelOrder = await cancelBetFairOrder(minimalOrder);

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

export const reduceSizeAction = async (order) => {
  //! order with everything removed that might make the payload too large
  const minimalOrder = {};
  Object.keys(order).map((key) => {
    if (key !== 'unmatchedBets' && key !== 'matchedBets' && key !== 'callback') {
      minimalOrder[key] = order[key];
    }
  });

  const cancelOrder = await fetch('/api/cancel-order', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(minimalOrder),
  })
    .then((res) => res.json())
    .catch(() => false);

  if (cancelOrder && cancelOrder.status === 'SUCCESS') {
    const newUnmatchedBets = { ...order.unmatchedBets };
    newUnmatchedBets[order.betId].size = parseFloat((order.size - cancelOrder.instructionReports[0].sizeCancelled).toFixed(2));

    const newBets = {
      unmatched: newUnmatchedBets,
      matched: order.matchedBets ? order.matchedBets : {},
    };
    return newBets;
  }
  return {
    unmatched: order.unmatchedBets ? order.unmatchedBets : {},
    matched: order.matchedBets ? order.matchedBets : {},
  };
};

export const cancelBetFairOrder = (order) => new Promise(async (res, rej) => {
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
