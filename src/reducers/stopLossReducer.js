const initialState = {
  selected: false,
  offset: 5,
  units: "Ticks",
  trailing: true,
  hedged: true,
  list: {}, // {marketId: , selectionId: , price(matchedPrice): , side: , size: , tickOffset: , trailing: , units: , rfs(reference strategy): , assignedIsOrderMatched: false}
  selections: null
};
initialState.text = `${initialState.offset} ${initialState.units} [${
  initialState.trailing ? "x" : "-"
}][${initialState.hedged ? "x" : "-"}]`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_STOP_LOSS_SELECTED":
      return { ...state, selected: !state.selected };
    case "SET_STOP_LOSS_TEXT":
      return { ...state, text: action.payload };
    case "SET_STOP_LOSS_OFFSET":
      return { ...state, offset: action.payload };
    case "SET_STOP_LOSS_UNITS":
      return { ...state, units: action.payload };
    case "TOGGLE_STOP_LOSS_TRAILING":
      return { ...state, trailing: action.payload };
    case "TOGGLE_STOP_LOSS_HEDGED":
      return { ...state, hedged: action.payload };
    case "UPDATE_STOP_LOSS_LIST": 
      return { ...state, list: action.payload };
    case "SET_STOP_LOSS_SELECTIONS":
      return { ...state, selections: action.payload };
    default:
      return state;
  }
};

export default reducer;
