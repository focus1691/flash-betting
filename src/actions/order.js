import { updateFillOrKillList } from "./fillOrKill";

export const updateOrders = order => {
  return {
    type: "UPDATE_BET",
    payload: order
  };
};

export const placeOrder = order => {
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

        const betId = json.instructionReports[0].betId;

        const adjustedOrder = Object.assign({}, order);
        adjustedOrder.rfs = order.customerStrategyRef;
        adjustedOrder.betId = betId;
        
        const newUnmatchedBets = Object.assign({}, order.unmatchedBets)
        newUnmatchedBets[betId] = adjustedOrder;
        
        const newBets = {
          unmatched: newUnmatchedBets,
          matched: order.matchedBets
        }

        await fetch('/api/save-order', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(adjustedOrder)
        })

        order.orderCompleteCallBack(betId);

        dispatch(updateOrders(newBets));
        
      });
  };

};

export const cancelOrder = order => {

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

        dispatch(updateOrders("adad"));
      });
  };
};

