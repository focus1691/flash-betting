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

        dispatch(updateOrders("adad"));
      });
  };
};
