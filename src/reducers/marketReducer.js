const initialState = {
  marketOpen: false,
  currentMarket: {},
  runnerSelection: 0,
  runners: {},
  ladder: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOAD_MARKET":
      return { ...state, marketOpen: true, currentMarket: action.payload };
    case "LOAD_LADDER":
      return { ...state, ladder: action.payload };
    case "LOAD_RUNNERS":
      return { ...state, runners: action.payload };
    case "SELECT_RUNNER":
      return { ...state, runnerSelection: action.payload };
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
    default:
      return state;
  }
};

export default reducer;
