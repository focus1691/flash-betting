import { omit } from 'lodash';

const initialState = {
  bets: {
    matched: {},
    unmatched: {
      131652: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 2,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 22242,
      },
      333333: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 333333,
      },
      99999999: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 99999999,
      },
      777777777: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 777777777,
      },
      22222: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 22222,
      },
      8352: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 8352,
      },
      732521: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 732521,
      },
      24242: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 24242,
      },
      7363535: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 7363535,
      },
      435435: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 435435,
      },
      12444: {
        marketId: '1.185499478',
        selectionId: '131652',
        strategy: 'None',
        size: 20,
        price: '2.02',
        sizeMatched: 1.5,
        sizeRemaining: 0.5,
        side: 'BACK',
        betId: 12444,
      },
    },
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
