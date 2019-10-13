import { calcLayBet } from '../utils/TradingStategy/HedingCalculator'

export const updateOrders = order => {
  return {
    type: "UPDATE_BET",
    payload: order
  };
};

export const placeOrder = order => {

  if (order.unmatchedBets === undefined || order.matchedBets === undefined) {
    return
  }

  order.size = order.size === "LAY" ? calcLayBet(order.price, order.size).liability : parseFloat(order.size)
  order.price = parseFloat(order.price)

  return dispatch => {
    return fetch('/api/place-order', {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(order)
    })
      .then(res => res.json())
      .then(async json => {

        console.log(json)

        if (json.errorCode == "BET_ACTION_ERROR") return;
        const betId = json.instructionReports[0].betId;
        

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
        await fetch('/api/save-order', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(adjustedOrder)
        })

        if (order.orderCompleteCallBack !== undefined)
          await order.orderCompleteCallBack(betId);

        dispatch(updateOrders(newBets));
        
      });
  };

};

export const cancelOrder = order => {

  if (order.unmatchedBets === undefined || order.matchedBets === undefined) {
    return
  }

  return dispatch => {
    return fetch('/api/cancel-order', {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(order)
    })
      .then(res => res.json())
      .then(json => {
        const newUnmatchedBets = {};
        for (const key in order.unmatchedBets) {
          if (key !== order.betId) {
            newUnmatchedBets[key] = order.unmatchedBets[key] 
          }
        }

        const newBets = {
          unmatched: newUnmatchedBets,
          matched: order.matchedBets == undefined ? {} : order.matchedBets
        }

        dispatch(updateOrders(newBets));
      });
  };
};

