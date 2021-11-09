import update from 'immutability-helper';
import { setupStorage } from '../../localStorage/settings';

setupStorage();

const initialState = {
  defaultView: localStorage.getItem('defaultView').replace(/['"]+/g, ''),
  view: localStorage.getItem('defaultView').replace(/['"]+/g, ''),
  isLoading: true,
  premiumMember: false,
  premiumPopupOpen: false,
  fullscreen: false,
  drawerOpen: true,
  sounds: JSON.parse(localStorage.getItem('sounds')),
  tools: JSON.parse(localStorage.getItem('tools')),
  unmatchedBets: JSON.parse(localStorage.getItem('unmatchedBets')),
  matchedBets: JSON.parse(localStorage.getItem('matchedBets')),
  graphs: JSON.parse(localStorage.getItem('graphs')),
  marketInfo: JSON.parse(localStorage.getItem('marketInfo')),
  winMarketsOnly: JSON.parse(localStorage.getItem('winMarketsOnly')),
  rules: JSON.parse(localStorage.getItem('rules')),
  ladderUnmatched: localStorage.getItem('ladderUnmatched'),
  stakeBtns: JSON.parse(localStorage.getItem('stakeBtns')),
  layBtns: JSON.parse(localStorage.getItem('layBtns')),
  stake: {},
  oneClickStake: { buttonType: '', buttonSelected: null },
  rightClickTicks: JSON.parse(localStorage.getItem('rightClickTicks')),
  horseRaces: JSON.parse(localStorage.getItem('horseRaces')),
  laddersExpanded: JSON.parse(localStorage.getItem('laddersExpanded')),
  toolsExpanded: JSON.parse(localStorage.getItem('toolsExpanded')),
  unmatchedBetsExpanded: JSON.parse(localStorage.getItem('unmatchedBetsExpanded')),
  matchedBetsExpanded: JSON.parse(localStorage.getItem('matchedBetsExpanded')),
  graphExpanded: JSON.parse(localStorage.getItem('graphExpanded')),
  marketInfoExpanded: JSON.parse(localStorage.getItem('marketInfoExpanded')),
  rulesExpanded: JSON.parse(localStorage.getItem('rulesExpanded')),
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DEFAULT_VIEW':
      return { ...state, defaultView: action.payload };
    case 'ACTIVE_VIEW':
      return { ...state, view: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PREMIUM_STATUS':
      return { ...state, premiumMember: action.payload };
    case 'TOGGLE_POPUP':
      return { ...state, premiumPopupOpen: action.payload };
    case 'FULL_SCREEN':
      return { ...state, fullscreen: action.payload };
    case 'TOGGLE_SOUNDS':
      return { ...state, sounds: action.payload };
    case 'TOGGLE_TOOLS':
      return { ...state, tools: action.payload };
    case 'TOGGLE_UNMATCHED_BETS':
      return { ...state, unmatchedBets: action.payload };
    case 'TOGGLE_MATCHED_BETS':
      return { ...state, matchedBets: action.payload };
    case 'TOGGLE_GRAPH':
      return { ...state, graphs: action.payload };
    case 'TOGGLE_MARKET_INFORMATION':
      return { ...state, marketInfo: action.payload };
    case 'SET_WIN_MARKETS':
      return { ...state, winMarketsOnly: action.payload };
    case 'TOGGLE_RULES':
      return { ...state, rules: action.payload };
    case 'TOGGLE_LADDER_UNMATCHED_COLUMN':
      return { ...state, ladderUnmatched: action.payload };
    case 'SET_STAKE_BUTTONS':
      return { ...state, stakeBtns: action.payload };
    case 'SET_LAY_BUTTONS':
      return { ...state, layBtns: action.payload };
    case 'UPDATE_STAKE_BUTTON':
      return update(state, { stakeBtns: { [action.payload.id]: { $set: action.payload.value } } });
    case 'UPDATE_LAY_BUTTON':
      return update(state, { layBtns: { [action.payload.id]: { $set: action.payload.value } } });
    case 'SET_STAKE':
      return {
        ...state,
        stake: {
          ...state.stake,
          [action.payload.selectionId]: action.payload.price,
        },
      };
    case 'SET_STAKE_IN_ONE_CLICK_MODE':
      return {
        ...state,
        oneClickStake: {
          buttonType: action.payload.buttonType,
          buttonSelected: action.payload.buttonSelected,
        },
      };
    case 'SET_RIGHT_CLICK_TICKS':
      return { ...state, rightClickTicks: action.payload };
    case 'SET_HORSE_RACE_COUNTRIES':
      return { ...state, horseRaces: action.payload };
    case 'SET_LADDERS_EXPANDED':
      localStorage.setItem('laddersExpanded', JSON.stringify(action.payload));
      return { ...state, laddersExpanded: action.payload };
    case 'SET_TOOLS_EXPANDED':
      localStorage.setItem('toolsExpanded', JSON.stringify(action.payload));
      return { ...state, toolsExpanded: action.payload };
    case 'SET_UNMATCHED_BETS_EXPANDED':
      localStorage.setItem('unmatchedBetsExpanded', JSON.stringify(action.payload));
      return { ...state, unmatchedBetsExpanded: action.payload };
    case 'SET_MATCHED_BETS_EXPANDED':
      localStorage.setItem('matchedBetsExpanded', JSON.stringify(action.payload));
      return { ...state, matchedBetsExpanded: action.payload };
    case 'SET_GRAPHS_EXPANDED':
      localStorage.setItem('graphExpanded', JSON.stringify(action.payload));
      return { ...state, graphExpanded: action.payload };
    case 'SET_MARKET_INFO_EXPANDED':
      localStorage.setItem('marketInfoExpanded', JSON.stringify(action.payload));
      return { ...state, marketInfoExpanded: action.payload };
    case 'SET_RULES_EXPANDED':
      localStorage.setItem('rulesExpanded', JSON.stringify(action.payload));
      return { ...state, rulesExpanded: action.payload };
    case 'SET_DRAWER_OPEN':
      return { ... state, drawerOpen: action.payload };
    default:
      return state;
  }
};

export default reducer;
