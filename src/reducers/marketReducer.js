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
                  price: action.payload.price,
                  visible: action.payload.visible
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
