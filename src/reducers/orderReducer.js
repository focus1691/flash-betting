const initialState = {
  bets: {
    matched: {},
    unmatched: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLACE_ORDER':
      return { ...state, bets: action.payload };
    case 'UPDATE_BET':
      console.log(action.payload, state);
      return { ...state, bets: action.payload };
    default:
      return state;
  }
};

export default reducer;
