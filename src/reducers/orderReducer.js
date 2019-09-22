const initialState = {
  bets: {
    matched: [],
    unmatched: []
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "PLACE_ORDER":
      return state;
    case "UPDATE_BET":
      return state;
    default:
      return state;
  }
};

export default reducer;
