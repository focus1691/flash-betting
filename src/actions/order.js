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
      .then(json => {
        
        const betId = json.instructionReports[0].betId;

        order.orderCompleteCallBack(betId);
        dispatch(updateOrders("adad"));
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

