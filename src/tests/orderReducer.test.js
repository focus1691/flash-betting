import betReducer from '../reducers/orderReducer';
import backReducer from '../reducers/backReducer';
import tosReducer from '../reducers/tickOffsetReducer';

describe('bets reducer', () => {
  const emptyState = {
    bets: {
      matched: {},
      unmatched: {},
    },
  };

  const initialState = {
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

  const updatedState = {
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

  it('should return the initial state', () => {
    expect(betReducer(undefined, {})).toEqual(emptyState);
  });

  it('should handle ADD_UNMATCHED_BET', () => {
    expect(
      betReducer(undefined, {
        type: 'ADD_UNMATCHED_BET',
        payload: initialState.bets.unmatched[23232232],
      }),
    ).toEqual(initialState);
  });

  it('should handle UPDATE_SIZE_MATCHED', () => {
    expect(
      betReducer(initialState, {
        type: 'UPDATE_SIZE_MATCHED',
        payload: {
          betId: '23232232',
          sizeMatched: 1.5,
          sizeRemaining: 0.5,
        },
      }),
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
            sizeRemaining: 0.5,
            side: 'BACK',
            betId: '23232232',
            rfs: '142124124sdffs',
            trailing: false,
            hedged: false,
            assignedIsOrderMatched: false,
          },
        },
      },
    });
  });

  it('should handle SET_BET_EXECUTION_COMPLETE', () => {
    expect(
      betReducer(initialState, {
        type: 'SET_BET_EXECUTION_COMPLETE',
        payload: {
          betId: '23232232',
          sizeMatched: 2,
          sizeRemaining: 0,
        },
      }),
    ).toEqual(updatedState);
  });
});

describe('Cancel bets made with tools', () => {
  it('should handle REMOVE_BACK_BET', () => {
    const initialState = {
      list: {
        2424242: [
          {
            strategy: 'Back',
            marketId: '1.2525111',
            selectionId: 2424242,
            executionTime: 100,
            timeOffset: 2 * 3600 + 1 * 60 + 10,
            size: 2,
            price: '2.02',
            rfs: '241142114141',
          },
          {
            strategy: 'Back',
            marketId: '1.2525111',
            selectionId: 2424242,
            executionTime: 100,
            timeOffset: 2 * 3600 + 1 * 60 + 10,
            size: 2,
            price: '2.02',
            rfs: '11111111111',
          },
        ],
      },
    };

    expect(
      backReducer(initialState, {
        type: 'REMOVE_BACK_BET',
        payload: {
          selectionId: 2424242,
          rfs: '11111111111',
        },
      }),
    ).toEqual({
      list: {
        2424242: [
          {
            strategy: 'Back',
            marketId: '1.2525111',
            selectionId: 2424242,
            executionTime: 100,
            timeOffset: 2 * 3600 + 1 * 60 + 10,
            size: 2,
            price: '2.02',
            rfs: '241142114141',
          },
        ],
      },
    });
  });

  it('should handle REMOVE_TICK_OFFSET', () => {
    const initialState = {
      list: {
        111333: {
          strategy: 'Tick Offset',
          rfs: '111333',
          marketId: '1.754643',
          selectionId: 222,
        },
        5352532: {
          strategy: 'Tick Offset',
          rfs: '5352532',
          marketId: '1.754643',
          selectionId: 333,
        },
        845645: {
          strategy: 'Tick Offset',
          rfs: '845645',
          marketId: '1.754643',
          selectionId: 5555,
        },
      },
    };
    expect(
      tosReducer(initialState, {
        type: 'REMOVE_TICK_OFFSET',
        payload: {
          rfs: '111333',
        },
      }),
    ).toEqual({
      list: {
        5352532: {
          strategy: 'Tick Offset',
          rfs: '5352532',
          marketId: '1.754643',
          selectionId: 333,
        },
        845645: {
          strategy: 'Tick Offset',
          rfs: '845645',
          marketId: '1.754643',
          selectionId: 5555,
        },
      },
    });
  });
});

describe('Add bets made with noobs', () => {
  it('should handle REMOVE_BACK_BET', () => {

  });
});