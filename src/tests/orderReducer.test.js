import reducer from '../reducers/orderReducer';

const emptyState = {
  bets: {
    matched: {},
    unmatched: {},
  },
};

const state1 = {
  bets: {
    matched: {},
    unmatched: {
      23232232: {
        strategy: 'BACK',
        marketId: '1.232323',
        size: 2,
        price: '2.02',
        sizeMatched: 0,
        sizeRemaining: 2,
        side: 'BACK',
        betId: '23232232',
        rfs: '142124124sdffs',
        trailing: false,
        hedged: false,
        assignedIsOrderMatched: false,
      },
    },
  },
};

const state2 = {
  bets: {
    matched: {
      23232232: {
        strategy: 'BACK',
        marketId: '1.232323',
        size: 2,
        price: '2.02',
        sizeMatched: 2,
        sizeRemaining: 0,
        side: 'BACK',
        betId: '23232232',
        rfs: '142124124sdffs',
        trailing: false,
        hedged: false,
        assignedIsOrderMatched: false,
      },
    },
    unmatched: {},
  },
};
describe('bets reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(emptyState);
  });

  it('should handle ADD_UNMATCHED_BET', () => {
    expect(
      reducer(undefined, {
        type: 'ADD_UNMATCHED_BET',
        payload: state1.bets.unmatched[23232232],
      })
    ).toEqual(state1)
  });

  it('should handle UPDATE_SIZE_MATCHED', () => {
    expect(
      reducer(state1, {
        type: 'UPDATE_SIZE_MATCHED',
        payload: {
          betId: '23232232',
          sizeMatched: 1.5,
          sizeRemaining: .5,
        },
      })
    ).toEqual({
      bets: {
        matched: {},
        unmatched: {
          23232232: {
            strategy: 'BACK',
            marketId: '1.232323',
            size: 2,
            price: '2.02',
            sizeMatched: 1.5,
            sizeRemaining: .5,
            side: 'BACK',
            betId: '23232232',
            rfs: '142124124sdffs',
            trailing: false,
            hedged: false,
            assignedIsOrderMatched: false,
          }
        },
      }
    })
  });

  it('should handle UPDATE_BET_EXECUTION_COMPLETE', () => {
    expect(
      reducer(state1, {
        type: 'UPDATE_BET_EXECUTION_COMPLETE',
        payload: {
          betId: '23232232',
          sizeMatched: 2,
          sizeRemaining: 0,
        },
      })
    ).toEqual(state2)
  });
});
