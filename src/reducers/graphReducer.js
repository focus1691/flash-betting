const initialState = {
  transparent: false,
  open: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_GRAPH_TRANSPARENCY":
      return { ...state, transparent: action.payload };
    case "OPEN_GRAPH":
      return { ...state, open: !state.open };
    default:
      return state;
  }
};

export default reducer;