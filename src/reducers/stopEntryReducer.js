const initialState = {
  selected: false,
  operator: "<",
  ticks: 3,
  stake: 2,
  price: 2,
  side: 'BACK',
  list: {}, // {selectionId(parameter): [{targetLTP: , stopEntryCondition: , side: , size: , price: },]  }
  selections: null
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
    case "SET_STOP_ENTRY_SIDE":
      return { ...state, side: action.payload };
    case "UPDATE_STOP_ENTRY_LIST":
      return { ...state, list: action.payload };
    case "SET_STOP_ENTRY_SELECTIONS":
      return { ...state, selections: action.payload };
    default:
      return state;
  }
};

export default reducer;
