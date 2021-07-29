const initialState = {
  isLoaded: false,
  excludedLadders: [],
  ladderOrder: {},
  layFirstCol: true,
  draggingLadder: false,
  priceType: 'STAKE',
  marketPL: {},
  oddsHovered: { selectionId: 0, odds: 0, side: 'BACK' },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LADDER_LOADED':
      return { ...state, isLoaded: action.payload };
    case 'EXCLUDE_LADDERS':
      return { ...state, excludedLadders: action.payload };
    case 'UPDATE_LADDER_ORDER':
      return { ...state, ladderOrder: action.payload };
    case 'SET_BACK_LAY_COL_LADDER_ORDER':
      return { ...state, layFirstCol: !state.layFirstCol };
    case 'SET_ODDS_HOVERED':
      return { ...state, oddsHovered: action.payload };
    case 'SWITCH_PRICE_TYPE':
      return { ...state, priceType: action.payload };
    case 'SET_MARKET_PL':
      return { ...state, marketPL: action.payload };
    case 'SET_DRAGGING_LADDER':
      return { ...state, draggingLadder: action.payload };
    default:
      return state;
  }
};

export default reducer;
