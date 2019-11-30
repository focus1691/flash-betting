import update from 'immutability-helper';

const initialState = {
  defaultView: null,
  view: null,
  isLoading: true,
  premiumMember: false,
  selectedPremium: 'monthly',
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
  winMarketsOnly: true,
  rules: {
    visible: false,
    open: false
  },
  trainingLadderAutoCenter: false,
  ladderUnmatched: "hedged",
  stakeBtns: [2, 4, 6, 8, 10, 12, 14],
  layBtns: [2.5, 5, 7.5, 10, 12.5, 15, 17.5],
  stake: {},
  rightClickTicks: 1,
  horseRaces: {
    GB: true,
    IE: false,
    FR: false,
    DE: false,
    IT: false,
    AE: false,
    TR: false,
    SG: false,
    SE: false,
    US: false,
    AU: false,
    NZ: false,
    ZA: false
  },
  laddersExpanded: true,
  toolsExpanded: true,
  unmatchedBetsExpanded: true,
  matchedBetsExpanded: true,
  graphExpanded: true,
  marketInfoExpanded: true,
  rulesExpanded: true
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_DEFAULT_VIEW":
      return { ...state, defaultView: action.payload };
    case "ACTIVE_VIEW":
      return { ...state, view: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_PREMIUM_STATUS":
      return { ...state, premiumMember: action.payload };
    case "TOGGLE_POPUP":
      return { ...state, premiumPopupOpen: action.payload };
    case "SET_SELECTED_PREMIUM":
      return { ...state, selectedPremium: action.payload };
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
    case "SET_WIN_MARKETS":
      return { ...state, winMarketsOnly: action.payload };
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
      return { ...state, stake: newStake };
    case "SET_RIGHT_CLICK_TICKS":
      return { ...state, rightClickTicks: action.payload };
    case "SET_HORSE_RACE_COUNTRIES":
      return { ...state, horseRaces: action.payload };
    case "SET_LADDERS_EXPANDED":
      return { ...state, laddersExpanded: action.payload };
    case "SET_TOOLS_EXPANDED":
      return { ...state, toolsExpanded: action.payload };
    case "SET_UNMATCHED_BETS_EXPANDED":
      return { ...state, unmatchedBetsExpanded: action.payload };
    case "SET_MATCHED_BETS_EXPANDED":
      return { ...state, matchedBetsExpanded: action.payload };
    case "SET_GRAPHS_EXPANDED":
      return { ...state, graphExpanded: action.payload };
    case "SET_MARKET_INFO_EXPANDED":
      return { ...state, marketInfoExpanded: action.payload };
    case "SET_RULES_EXPANDED":
      return { ...state, rulesExpanded: action.payload };
    default:
      return state;
  }
};

export default reducer;
