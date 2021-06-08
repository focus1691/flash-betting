import { omit } from 'lodash';

const initialState = {
  bets: {
    matched: {},
    unmatched: {},
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_BET':
      return { ...state, bets: action.payload };
    case 'ADD_MATCHED_BET':
      return {
        ...state,
        bets: {
          ...state.bets,
          matched: {
            ...state.bets.matched,
            [action.payload.betId]: {
              ...action.payload,
            },
          },
        },
      };
    case 'ADD_UNMATCHED_BET':
      return {
        ...state,
        bets: {
          ...state.bets,
          unmatched: {
            ...state.bets.unmatched,
            [action.payload.betId]: {
              ...action.payload,
            },
          },
        },
      };
    case 'REMOVE_UNMATCHED_BET':
      return {
        ...state,
        bets: {
          ...state.bets,
          unmatched: omit(state.bets.unmatched, action.payload.betId),
        },
      };
    case 'REMOVE_UNMATCHED_BETS':
      return {
        ...state,
        bets: {
          ...state.bets,
          unmatched: omit(state.bets.unmatched, action.payload.betIds),
        },
      };
    case 'UPDATE_SIZE_MATCHED':
      return {
        ...state,
        bets: {
          ...state.bets,
          unmatched: {
            ...state.bets.unmatched,
            [action.payload.betId]: {
              ...state.bets.unmatched[action.payload.betId],
              sizeMatched: action.payload.sizeMatched,
              sizeRemaining: action.payload.sizeRemaining,
            },
          },
        },
      };
    case 'SET_BET_EXECUTION_COMPLETE':
      return {
        ...state,
        bets: {
          ...state.bets,
          matched: {
            ...state.bets.matched,
            [action.payload.betId]: {
              ...state.bets.unmatched[action.payload.betId],
              price: action.payload.price,
              sizeMatched: action.payload.sizeMatched,
              sizeRemaining: action.payload.sizeRemaining,
            },
          },
          unmatched: omit(state.bets.unmatched, action.payload.betId),
        },
      };
    case 'UPDATE_BET_PRICE':
      return {
        ...state,
        bets: {
          ...state.bets,
          unmatched: {
            ...state.bets.unmatched,
            [action.payload.newBetId]: {
              ...state.bets.unmatched[action.payload.betId],
              price: action.payload.price,
            },
          },
        },
      };
    default:
      return state;
  }
};

export default reducer;
