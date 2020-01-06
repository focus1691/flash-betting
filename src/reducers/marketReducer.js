const initialState = {
  marketOpen: false,
  inPlay: false,
  inPlayTime: null,
  pastEventTime: false,
  status: 'OPEN',
  eventType: null,
  initialClk: null,
  clk: null,
  currentMarket: {},
  runnerSelection: 0,
  nonRunners: {},
  runners: {},
  ladder: {},
  sortedLadder: [],
  excludedLadders: [], 
  ladderOrder: {},
  oneClickOn: false,
  priceType: "STAKE",
  myMarkets: [],
  marketPL: {},
  ladderSideLeft: "LAY",
  oddsHovered: {selectionId: 0, odds: 0, side: "BACK"},
  draggingLadder: false, // selection id of the ladder dragged
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "NEW_MARKET_STATUS":
      return { ...state, status: action.payload };
    case "SET_IN_PLAY":
      return { ...state, inPlay: action.payload };
    case "SET_IN_PLAY_TIME":
      return { ...state, inPlayTime: action.payload };
    case "SET_PAST_EVENT_TIME":
      return { ...state, pastEventTime: action.payload };
    case "LOAD_MARKET":
      return { ...state, currentMarket: action.payload };
    case "CLOSE_MARKET":
      return { ...state, marketOpen: action.payload };
    case "SET_EVENT_TYPE":
      return { ...state, eventType: action.payload };
    case "SET_INITIAL_CLOCK":
      return { ...state, initialClk: action.payload };
    case "SET_CLOCK":
      return { ...state, clk: action.payload };
    case "LOAD_LADDER":
      return { ...state, marketOpen: true, ladder: action.payload };
    case "SET_SORTED_LADDER":
      return { ...state, sortedLadder: action.payload };
    case "LOAD_NON_RUNNERS":
      return { ...state, nonRunners: action.payload };
    case "LOAD_RUNNERS":
      return { ...state, runners: action.payload };
    case "EXCLUDE_LADDERS":
      return { ...state, excludedLadders: action.payload };
    case "UPDATE_LADDER_ORDER": 
      return { ...state, ladderOrder: action.payload };
    case "SELECT_RUNNER":
      return { ...state, runnerSelection: action.payload };
    case "TOGGLE_ONE_CLICK":
        return { ...state, oneClickOn: action.payload };
    case "LOAD_MY_MARKETS":
        return { ...state, myMarkets: action.payload };
    case "UPDATE_ORDER":
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              backLay: action.payload.backLay,
              stake: action.payload.stake,
              price: action.payload.price,
              visible: action.payload.visible
            }
          }
        }
      };
      case "UPDATE_ORDER_VALUE":
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              stake: action.payload.stake
            }
          }
        }
      };
    case "UPDATE_ORDER_PRICE":
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              price: action.payload.price
            }
          }
        }
      };
    case "TOGGLE_STAKE_AND_LIABILITY":
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              stakeLiability: state.runners[action.payload.id].order.stakeLiability ^ 1
            }
          }
        }
      };
      case "TOGGLE_BACK_AND_LAY":
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              backLay: state.runners[action.payload.id].order.backLay ^ 1
            }
          }
        }
      };
    case "TOGGLE_ORDER_VISIBILITY":
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              visible: action.payload.visible
            }
          }
        }
      };
    case "SWITCH_PRICE_TYPE":
      return { ...state, priceType: action.payload };
    case "SWITCH_LADDER_SIDE_LEFT":
      return { ...state, ladderSideLeft: action.payload };
    case "SET_ODDS_HOVERED":
      return { ...state, oddsHovered: action.payload };
    case "SET_MARKET_PL":
      return { ...state, marketPL: action.payload };
    case "SET_DRAGGING_LADDER":
      return { ...state, draggingLadder: action.payload };
    default:
      return state;
  }
};

export default reducer;
