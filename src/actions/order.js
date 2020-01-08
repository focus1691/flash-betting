import { calcLayBet } from '../utils/TradingStategy/HedingCalculator'

export const updateOrders = order => {
  return {
    type: "UPDATE_BET",
    payload: order
  };
};

export const placeOrder = order => {

  const newSize = order.side === "LAY" ? calcLayBet(order.price, order.size).liability : parseFloat(order.size)

  if (order.unmatchedBets === undefined || order.matchedBets === undefined) {
    return
  }

  order.size = newSize
  order.price = parseFloat(order.price)

  if (parseFloat(newSize) < 2.0) {
    return async dispatch => {
      const startingOrder = await placeOrderAction(Object.assign({}, order, {price: 1.01, size: 2, orderCompleteCallBack: undefined}))
      
      if (startingOrder === null) return

      await dispatch(updateOrders(startingOrder.bets));
      
      // cancel part of the first one
      const reducedOrderBets = await reduceSizeAction(Object.assign({}, startingOrder.order, 
        { unmatchedBets: startingOrder.bets.unmatched, 
          matchedBets: startingOrder.bets.matched, 
          sizeReduction: parseFloat((2 - newSize).toFixed(2))
        }))


      await dispatch(updateOrders(reducedOrderBets));

      // replaceOrder, editing the price
      const replaceOrderRequest = await fetch('/api/replace-orders', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          marketId: startingOrder.order.marketId,
          betId: startingOrder.order.betId,
          newPrice: order.price,
          customerStrategyRef: order.customerStrategyRef
        })
      })
      .then(res => res.json())

      if (replaceOrderRequest.status === "SUCCESS") {
        const newUnmatchedBets = Object.assign({}, reducedOrderBets.unmatched);
        newUnmatchedBets[startingOrder.order.betId].price = order.price;
        delete newUnmatchedBets[startingOrder.order.betId].unmatchedBets;
        delete newUnmatchedBets[startingOrder.order.betId].matchedBets;

        return dispatch(updateOrders({
          unmatched: newUnmatchedBets,
          matched: startingOrder.bets.matched
        }));
      } else {
        return dispatch(updateOrders({
          unmatched: startingOrder.bets.unmatched,
          matched: startingOrder.bets.matched
        }));
      }
      
    }
  }

  return async dispatch  => {
    const result = await placeOrderAction(order)

    if (result !== null) {
      return dispatch(updateOrders(result.bets));
    }  
    
  };
};

export const placeOrderAction = async (order) => {

  // order without anything that might make the payload too large
  const minimalOrder = {}
  Object.keys(order).map((key) => {
    if (key !== "unmatchedBets" && key !== "matchedBets" && key !== "orderCompleteCallBack") {
      minimalOrder[key] = order[key]
    }
  })

  minimalOrder.size = parseFloat(minimalOrder.size).toFixed(2)


  return fetch('/api/place-order', {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(minimalOrder)
  })
    .then(res => res.json())
    .then(async result => {

      if (!result || result.status === "FAILURE") return null;

      const betId = result.instructionReports[0].betId;
      
      const adjustedOrder = Object.assign({}, minimalOrder);
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

  return async dispatch => {
    const newBets = await cancelOrderAction(order)
    return dispatch(updateOrders(newBets));
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

export const reduceSizeAction = async order => {
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

  if (cancelOrder && cancelOrder.status === "SUCCESS") {
    const newUnmatchedBets = Object.assign({}, order.unmatchedBets);
    newUnmatchedBets[order.betId].size = parseFloat((order.size - cancelOrder.instructionReports[0].sizeCancelled).toFixed(2))

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
