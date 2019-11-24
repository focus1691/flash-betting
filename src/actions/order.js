import { calcLayBet } from '../utils/TradingStategy/HedingCalculator'

export const updateOrders = order => {
  return {
    type: "UPDATE_BET",
    payload: order
  };
};

export const placeOrder = order => {

  const newSize = order.size === "LAY" ? calcLayBet(order.price, order.size).liability : parseFloat(order.size)

  if (order.unmatchedBets === undefined || order.matchedBets === undefined) {
    return
  }

  order.size = newSize
  order.price = parseFloat(order.price)

  // order without anything that might make the payload too large
  const minimalOrder = {}
  Object.keys(order).map((key) => {
    if (key !== "unmatchedBets" && key !== "matchedBets" && key !== "orderCompleteCallBack") {
      minimalOrder[key] = order[key]
    }
  })

  if (parseFloat(newSize) < 2.0) {
    return async dispatch => {
      const startingOrder = await placeOrderAction(Object.assign({}, minimalOrder, {price: 1000, size: 2, orderCompleteCallBack: undefined}))
      if (startingOrder === null) return

      await dispatch(updateOrders(startingOrder.bets));
      
      // add extra bit to it
      const secondOrder = await placeOrderAction(Object.assign({}, minimalOrder, {price: 1000, size: minimalOrder.size - 2, unmatchedBets: startingOrder.unmatched}))
      
      await dispatch(updateOrders(secondOrder.bets));

      if (secondOrder === null) {
        // cancel the first one since we don't have enough funds
        return cancelOrderAction(startingOrder.order).then(newBets => {
          dispatch(updateOrders(newBets));
        })
      }
      
      // cancel the first one
      await cancelOrderAction(startingOrder.order).then(async newBets => {
        await dispatch(updateOrders(newBets));
      })

      // replaceOrder, editing the price
      await fetch('/api/replace-orders', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: {
          marketId: secondOrder.marketId,
          betId: secondOrder.betId,
          newPrice: minimalOrder.price
        }
      }).then(() => {
        const newUnmatchedBets = Object.assign({}, secondOrder.bets.unmatched);
        newUnmatchedBets[secondOrder.order.betId].price = minimalOrder.price;
        dispatch(updateOrders({
          unmatched: newUnmatchedBets,
          matched: secondOrder.bets.matched
        }));
      })
    }
  }

  return dispatch => {
    placeOrderAction(minimalOrder).then(result => {
      if (result !== null) {
        dispatch(updateOrders(result.bets));
      }
    })
    
  };
};

export const placeOrderAction = async (order) => {
  return fetch('/api/place-order', {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(async result => {

      if (!result || result.status === "FAILURE") return null;

      const betId = result.instructionReports[0].betId;

      const adjustedOrder = Object.assign({}, order);
      adjustedOrder.rfs = order.customerStrategyRef;
      adjustedOrder.betId = betId;
      adjustedOrder.strategy = "None";
      if (betId === undefined) {
        return;
      }

      const newUnmatchedBets = Object.assign({}, order.unmatchedBets)
      newUnmatchedBets[betId] = adjustedOrder;

      const newBets = {
        unmatched: newUnmatchedBets,
        matched: order.matchedBets == undefined ? {} : order.matchedBets
      }

      if (order.orderCompleteCallBack !== undefined)
        await order.orderCompleteCallBack(betId, newUnmatchedBets);
      
      return { order: adjustedOrder, bets: newBets }

    });
}

export const cancelOrder = order => {

  if (order.unmatchedBets === undefined || order.matchedBets === undefined) {
    return
  }

  return dispatch => {
    return cancelOrderAction(order).then(newBets => {
      dispatch(updateOrders(newBets));
    })
  };
};

export const cancelOrderAction = async (order) => {

  // order with everything removed that might make the payload too large
  const minimalOrder = {}
  Object.keys(order).map((key) => {
    if (key !== "unmatchedBets" && key !== "matchedBets" && key !== "callback") {
      minimalOrder[key] = order[key]
    }
  })

  const cancelOrder = await fetch('/api/cancel-order', {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(minimalOrder)
  }).then(res => res.json()).catch(() => false);

  if (cancelOrder) {
    const newUnmatchedBets = {};
    for (const key in order.unmatchedBets) {
      if (key != order.betId) {
        newUnmatchedBets[key] = order.unmatchedBets[key]
      }
    }
    const newBets = {
      unmatched: newUnmatchedBets,
      matched: order.matchedBets ? order.matchedBets : {}
    }
    return newBets
  } else {
    return {
      unmatched: order.unmatchedBets ? order.unmatchedBets : {},
      matched: order.matchedBets ? order.matchedBets : {}
    };
  }
  
}


