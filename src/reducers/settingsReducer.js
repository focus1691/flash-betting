import update from 'immutability-helper';

const initialState = {
  view: "GridView",
  premiumMember: false,
  premiumPopupOpen: false,
  fullscreen: false,
  trainingBalance: 1000,
  sounds: false,
  tools: {
    visible: true,
    open: false
  },
  unmatchedBets: {
    visible: false,
    open: false
  },
  matchedBets: {
    visible: false,
    open: false
  },
  graphs: {
    visible: false,
    open: false
  },
  marketInfo: {
    visible: false,
    open: false
  },
  rules: {
    visible: false,
    open: false
  },
  trainingLadderAutoCenter: false,
  ladderUnmatched: {
    unmatchedBets: false,
    unmatchedBetsPL: false,
    unmatchedBetsHedge: false
  },
  stakeBtns: [2, 4, 6, 8, 10, 12, 14],
  layBtns: [2.5, 5, 7.5, 10, 12.5, 15, 17.5],
  stake: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ACTIVE_VIEW":
      return { ...state, view: action.payload };
    case "SET_PREMIUM_STATUS":
      return { ...state, premiumMember: action.payload };
    case "TOGGLE_POPUP":
      return { ...state, premiumPopupOpen: action.payload };
    case "FULL_SCREEN":
      return { ...state, fullscreen: action.payload };
    case "SET_TRAINING_BALANCE":
      return { ...state, trainingBalance: action.payload };
    case "TOGGLE_SOUNDS":
      return { ...state, sounds: action.payload };
    case "TOGGLE_TOOLS":
      return { ...state, tools: action.payload };
    case "TOGGLE_UNMATCHED_BETS":
      return { ...state, unmatchedBets: action.payload };
    case "TOGGLE_MATCHED_BETS":
      return { ...state, matchedBets: action.payload };
    case "TOGGLE_GRAPH":
      return { ...state, graphs: action.payload };
    case "TOGGLE_MARKET_INFORMATION":
      return { ...state, marketInfo: action.payload };
    case "TOGGLE_RULES":
      return { ...state, rules: action.payload };
    case "TOGGLE_TRAINING_LADDER_AUTO_CENTER":
      return { ...state, trainingLadderAutoCenter: action.payload };
    case "TOGGLE_LADDER_UNMATCHED_COLUMN":
      return { ...state, ladderUnmatched: action.payload };
    case "SET_STAKE_BUTTONS":
      return { ...state, stakeBtns: action.payload };
    case "SET_LAY_BUTTONS":
      return { ...state, layBtns: action.payload };
    case "UPDATE_STAKE_BUTTON":
      return update(state, { stakeBtns: { [action.payload.id]: { $set: action.payload.value } } });
    case "UPDATE_LAY_BUTTON":
      return update(state, { layBtns: { [action.payload.id]: { $set: action.payload.value } } });
    case "SET_STAKE_IN_ONE_CLICK_MODE":
      const newStake = Object.assign({}, state.stake);
      newStake[action.payload.selectionId] = action.payload.price
      console.log(newStake)
      return { ...state, stake: newStake };
    default:
      return state;
  }
};

export default reducer;
