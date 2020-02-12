const initialState = {
  selected: false,
  seconds: 10,
  list: {} // {betId(parameter): {seconds: , startTime: }   }
};
initialState.text = `${initialState.seconds} seconds`;

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILL_OR_KILL_SELECTED":
      return { ...state, selected: !state.selected };
    case "SET_FILL_OR_KILL_TEXT":
      return { ...state, text: action.payload };
    case "SET_FILL_OR_KILL_TIME":
      return { ...state, seconds: action.payload };
    case "UPDATE_FILL_OR_KILL_LIST":
      return { ...state, list: action.payload };
    case "REMOVE_FILL_OR_KILL_ORDER":
      let newList = Object.assign({}, state.list);
      delete newList[action.payload.selectionId];
      return { ...state, list: newList };
    default:
      return state;
  }
};

export default reducer;
