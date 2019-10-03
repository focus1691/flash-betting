const initialState = {
  selected: false,
  ticks: 2,
  units: "Ticks",
  percentTrigger: 2,
  hedged: false,
  list: {} // rfs: {marketId: , selectionId: , price: , size: , side: , percentageTrigger: , rfs:}
};
initialState.text = `${initialState.ticks} ${initialState.units} [${
  initialState.hedged ? "x" : "-"
}]`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TICK_OFFSET_SELECTED":
      return { ...state, selected: !state.selected };
    case "SET_TICK_OFFSET_TEXT":
      return { ...state, text: action.payload };
    case "SET_TICK_OFFSET_TICKS":
      return { ...state, ticks: action.payload };
    case "SET_TICK_OFFSET_UNIT":
      return { ...state, units: action.payload };
    case "SET_TICK_OFFSET_PERCENT_TRIGGER":
      return { ...state, percentTrigger: action.payload };
    case "TOGGLE_TICK_OFFSET_HEDGED":
      return { ...state, hedged: action.payload };
    case "UPDATE_TICK_OFFSET_LIST":
      return { ...state, list: action.payload };
    default:
      return state;
  }
};

export default reducer;
