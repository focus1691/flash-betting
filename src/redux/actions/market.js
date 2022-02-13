export const processMarketUpdates = (data) => ({
  type: 'PROCESS_MARKET_UPDATES',
  payload: data,
});

export const setInitialClk = (initialClk) => ({
  type: 'SET_INITIAL_CLK',
  payload: initialClk,
});

export const setClk = (clk) => ({
  type: 'SET_CLK',
  payload: clk,
});

export const setConnectionErrorMessage = (errorMessage) => ({
  type: 'SET_CONNECTION_ERROR_MESSAGE',
  payload: errorMessage,
});

export const setMarketName = (marketName) => ({
  type: 'SET_MARKET_NAME',
  payload: marketName,
});

export const setMarketStartTime = (marketStartTime) => ({
  type: 'SET_MARKET_START_TIME',
  payload: marketStartTime,
});

export const setInPlay = (inPlay) => ({
  type: 'SET_IN_PLAY',
  payload: inPlay,
});

export const setInPlayTime = (time) => ({
  type: 'SET_IN_PLAY_TIME',
  payload: time,
});

export const setPastEventTime = () => ({
  type: 'SET_PAST_EVENT_TIME',
  payload: true,
});

export const setMarketStatus = (status) => ({
  type: 'NEW_MARKET_STATUS',
  payload: status,
});

export const setMarketDescription = (description) => ({
  type: 'SET_MARKET_DESCRIPTION',
  payload: description,
});

export const closeMarket = () => ({
  type: 'CLOSE_MARKET',
  payload: false,
});

export const setMarketId = (marketId) => ({
  type: 'SET_MARKET_ID',
  payload: marketId,
});

export const setEvent = (event) => ({
  type: 'SET_EVENT',
  payload: event,
});

export const setEventType = (eventType) => ({
  type: 'SET_EVENT_TYPE',
  payload: eventType,
});

export const setOverround = () => ({
  type: 'SET_OVERROUND',
})

export const loadLadder = (ladder) => ({
  type: 'LOAD_LADDER',
  payload: ladder,
});

export const setLadderExpanded = (selectionId) => ({
  type: 'SET_LADDER_EXPANDED',
  payload: selectionId,
});

export const setLadderBottom = (selectionId, bottom) => ({
  type: 'SET_LADDER_BOTTOM',
  payload: { selectionId, bottom },
});

export const setSortedLadder = (sortedLadder) => ({
  type: 'SET_SORTED_LADDER',
  payload: sortedLadder,
});

export const loadRunners = (runners) => ({
  type: 'LOAD_RUNNERS',
  payload: runners,
});

export const loadRunnerResults = (runnerResults) => ({
  type: 'LOAD_RUNNER_RESULTS',
  payload: runnerResults,
});

export const addNonRunners = (nonRunners) => ({
  type: 'ADD_NON_RUNNERS',
  payload: nonRunners,
});

export const loadNonRunners = (nonRunners) => ({
  type: 'LOAD_NON_RUNNERS',
  payload: nonRunners,
});

export const setRunner = (runner) => ({
  type: 'SELECT_RUNNER',
  payload: runner,
});

export const updateOrder = (order) => ({
  type: 'UPDATE_ORDER',
  payload: order,
});

export const updateOrderValue = (val) => ({
  type: 'UPDATE_ORDER_VALUE',
  payload: val,
});

export const updateOrderPrice = ({ price, id }) => ({
  type: 'UPDATE_ORDER_PRICE',
  payload: { price, id },
});

export const toggleStakeAndLiability = ({ val, id }) => ({
  type: 'TOGGLE_STAKE_AND_LIABILITY',
  payload: { stakeLiability: val, id },
});

export const toggleBackAndLay = (id) => ({
  type: 'TOGGLE_BACK_AND_LAY',
  payload: { id },
});

export const toggleVisibility = (settings) => ({
  type: 'TOGGLE_ORDER_VISIBILITY',
  payload: settings,
});

export const setCustomStake = ({ id, customStake }) => ({
  type: 'UPDATE_CUSTOM_STAKE',
  payload: { id, customStake },
});

export const removeMatchedAmount = (selectionId) => ({
  type: 'REMOVE_MATCHED_AMOUNT',
  payload: selectionId,
})