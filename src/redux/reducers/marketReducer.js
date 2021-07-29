import { assign, omit } from 'lodash';
import { getOppositeSide } from '../../utils/Bets/GetOppositeSide';
import { CreateLadder } from '../../utils/ladder/CreateLadder';
import { UpdateLadder, constructNonRunnersObj } from '../../utils/ladder/UpdateLadder';
import { sortLadder, isGreyHoundRace } from '../../utils/ladder/SortLadder';
import GetRunnerResults from '../../utils/Market/GetRunnerResults';

const initialState = {
  initialClk: null,
  clk: null,
  connectionError: '',
  marketOpen: false,
  marketId: null,
  marketName: '',
  description: {},
  inPlay: false,
  inPlayTime: null,
  marketStartTime: null,
  pastEventTime: false,
  status: 'OPEN',
  event: { id: null, name: null, venue: null },
  eventType: {},
  runnerSelection: 0,
  nonRunners: {},
  runners: {},
  runnerResults: [],
  ladder: {},
  sortedLadder: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_INITIAL_CLK':
      return { ...state, initialClk: action.payload };
    case 'SET_CLK':
      return { ...state, clk: action.payload };
    case 'SET_CONNECTION_ERROR_MESSAGE':
      return { ...state, connectionError: action.payload };
    case 'SET_MARKET_NAME':
      return { ...state, marketName: action.payload };
    case 'SET_MARKET_ID':
      return { ...state, marketId: action.payload };
    case 'NEW_MARKET_STATUS':
      return { ...state, status: action.payload };
    case 'SET_MARKET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_MARKET_START_TIME':
      return { ...state, marketStartTime: action.payload };
    case 'SET_IN_PLAY':
      return { ...state, inPlay: action.payload };
    case 'SET_IN_PLAY_TIME':
      return { ...state, inPlayTime: action.payload };
    case 'SET_PAST_EVENT_TIME':
      return { ...state, pastEventTime: action.payload };
    case 'CLOSE_MARKET':
      return { ...state, marketOpen: action.payload };
    case 'SET_EVENT':
      return { ...state, event: action.payload };
    case 'SET_EVENT_TYPE':
      return { ...state, eventType: action.payload };
    case 'LOAD_LADDER':
      return {
        ...state,
        marketOpen: true,
        ladder: {
          ...state.ladder,
          [action.payload.id]: state.ladder[action.payload.id] ? UpdateLadder(state.ladder[action.payload.id], action.payload) : CreateLadder(action.payload),
        },
      };
    case 'SET_LADDER_EXPANDED':
      return {
        ...state,
        ladder: {
          ...state.ladder,
          [action.payload]: {
            ...state.ladder[action.payload],
            expanded: !state.ladder[action.payload].expanded,
          },
        },
      };
    case 'SET_LADDER_BOTTOM':
      return {
        ...state,
        ladder: {
          ...state.ladder,
          [action.payload.selectionId]: {
            ...state.ladder[action.payload.selectionId],
            bottom: action.payload.bottom,
          },
        },
      };
    case 'SET_SORTED_LADDER':
      return {
        ...state,
        // Greyhound races don't need to be sorted by LTP
        sortedLadder: isGreyHoundRace(state.eventType.id) ? state.sortedLadder : sortLadder(state.ladder),
      };
    case 'LOAD_NON_RUNNERS':
      return { ...state, nonRunners: action.payload };

    case 'ADD_NON_RUNNERS':
      return {
        ...state,
        nonRunners: assign(state.nonRunners, constructNonRunnersObj(action.payload)),
        ladder: omit(
          state.ladder,
          action.payload.map(({ id }) => id),
        ),
      };
    case 'LOAD_RUNNERS':
      return { ...state, runners: action.payload };
    case 'LOAD_RUNNER_RESULTS':
      return { ...state, runnerResults: GetRunnerResults(action.payload) };
    case 'SELECT_RUNNER':
      return { ...state, runnerSelection: action.payload };
    case 'UPDATE_ORDER':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              side: action.payload.side,
              stake: action.payload.stake,
              price: action.payload.price,
              visible: action.payload.visible,
            },
          },
        },
      };
    case 'UPDATE_ORDER_VALUE':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              stake: action.payload.stake,
            },
          },
        },
      };
    case 'UPDATE_ORDER_PRICE':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              price: action.payload.price,
            },
          },
        },
      };
    case 'UPDATE_CUSTOM_STAKE':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              customStake: action.payload.customStake,
            },
          },
        },
      };
    case 'TOGGLE_STAKE_AND_LIABILITY':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              stakeLiability: state.runners[action.payload.id].order.stakeLiability ^ 1,
            },
          },
        },
      };
    case 'TOGGLE_BACK_AND_LAY':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              side: getOppositeSide(state.runners[action.payload.id].order.side),
            },
          },
        },
      };
    case 'TOGGLE_ORDER_VISIBILITY':
      return {
        ...state,
        runners: {
          ...state.runners,
          [action.payload.id]: {
            ...state.runners[action.payload.id],
            order: {
              ...state.runners[action.payload.id].order,
              visible: action.payload.visible,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
