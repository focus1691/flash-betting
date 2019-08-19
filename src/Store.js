import React from "react";

export const Store = React.createContext();

const initialState = {
  balance: 0,
  sports: []
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_BALANCE":
      return {...state, balance: action.balance };
    case "FETCH_SPORTS":
      return { ...state, sports: action.payload };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
