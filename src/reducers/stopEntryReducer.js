const initialState = {
  selected: false,
  operator: "<",
  ticks: 3,
  stake: 2,
  price: 750
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STOP_ENTRY_SELECTED":
      return { ...state, selected: !state.selected };
    case "SET_STOP_ENTRY_OPERATOR":
      return { ...state, operator: action.payload };
    case "SET_STOP_ENTRY_TICKS":
      return { ...state, ticks: action.payload };
    case "SET_STOP_ENTRY_STAKE":
      return { ...state, stake: action.payload };
    case "SET_STOP_ENTRY_PRICE":
      return { ...state, price: action.payload };
    default:
      return state;
  }
};

export default reducer;
