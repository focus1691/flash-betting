import { getOppositeSide } from '../utils/Bets/GetOppositeSide';

const initialState = {
  marketOpen: false,
  marketId: null,
  marketName: '',
  description: {},
  inPlay: false,
  inPlayTime: null,
  marketStartTime: null,
  pastEventTime: false,
  status: 'OPEN',
  event: { id: null, name: null },
  eventType: {},
  runnerSelection: 0,
  nonRunners: {},
  runners: {},
  ladder: {},
  sortedLadder: [],
  excludedLadders: [],
  ladderOrder: {},
  layFirstCol: true,
  oneClickOn: false,
  priceType: 'STAKE',
  marketPL: {},
  oddsHovered: { selectionId: 0, odds: 0, side: 'BACK' },
  draggingLadder: false, // selection id of the ladder dragged
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
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
    case 'LOAD_LADDER'://! ladder
      return { ...state, marketOpen: true, ladder: action.payload };
    case 'SET_LADDER_EXPANDED'://! ladder
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
      return { ...state, sortedLadder: action.payload };
    case 'LOAD_NON_RUNNERS':
      return { ...state, nonRunners: action.payload };
    case 'LOAD_RUNNERS':
      return { ...state, runners: action.payload };
    case 'EXCLUDE_LADDERS'://! ladder
      return { ...state, excludedLadders: action.payload };
    case 'UPDATE_LADDER_ORDER'://! ladder
      return { ...state, ladderOrder: action.payload };
    case 'SET_BACK_LAY_COL_LADDER_ORDER'://! ladder
      return { ...state, layFirstCol: !state.layFirstCol };
    case 'SELECT_RUNNER'://! ladder / grid
      return { ...state, runnerSelection: action.payload };
    case 'TOGGLE_ONE_CLICK'://! grid
      return { ...state, oneClickOn: action.payload };
    case 'UPDATE_ORDER'://! grid
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
    case 'UPDATE_ORDER_VALUE'://! grid
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
    case 'UPDATE_ORDER_PRICE': //! grid
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
    case 'UPDATE_CUSTOM_STAKE': //! ladder
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
    case 'TOGGLE_STAKE_AND_LIABILITY'://! grid
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
    case 'TOGGLE_BACK_AND_LAY'://! ladder
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
    case 'TOGGLE_ORDER_VISIBILITY'://! grid
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
    case 'SWITCH_PRICE_TYPE'://! grid
      return { ...state, priceType: action.payload };
    case 'SET_ODDS_HOVERED': //! ladder
      return { ...state, oddsHovered: action.payload };
    case 'SET_MARKET_PL':
      return { ...state, marketPL: action.payload };
    case 'SET_DRAGGING_LADDER'://! ladder
      return { ...state, draggingLadder: action.payload };
    default:
      return state;
  }
};

export default reducer;
