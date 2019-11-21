const initialState = {
  transparent: false,
  graphOpen: false,
  liveStreamOpen: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_GRAPH_TRANSPARENCY":
      return { ...state, transparent: action.payload };
    case "OPEN_GRAPH":
      return { ...state, graphOpen: !state.graphOpen };
    case "OPEN_LIVE_STREAM":
      return { ...state, liveStreamOpen: !state.liveStreamOpen }
    default:
      return state;
  }
};

export default reducer;