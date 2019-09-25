const initialState = {
  transparent: false,
  open: false,
  pos: { x: 0, y: 0 }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_GRAPH_TRANSPARENCY":
      return { ...state, transparent: action.payload };
    case "OPEN_GRAPH":
      return { ...state, open: !state.open };
    case "MOVE_GRAPH":
      return { ...state, pos: action.payload };
    default:
      return state;
  }
};

export default reducer;