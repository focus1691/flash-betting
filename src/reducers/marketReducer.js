const initialState = {
  marketOpen: false,
  inPlay: false,
  status: 'OPEN',
  currentMarket: {},
  runnerSelection: 0,
  runners: {},
  ladder: {},
  excludedLadders: [], 
  ladderOrder: {},
  oneClickOn: false,
  priceType: "STAKE"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "NEW_MARKET_STATUS":
      return { ...state, status: action.payload };
    case "SET_IN_PLAY":
      return { ...state, inPlay: action.payload };
    case "LOAD_MARKET":
      return { ...state, currentMarket: action.payload };
    case "LOAD_LADDER":
      return { ...state, marketOpen: true, ladder: action.payload };
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
              stakeLiability: action.payload.stakeLiability
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
              backLay: action.payload.backLay
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
    default:
      return state;
  }
};

export default reducer;
