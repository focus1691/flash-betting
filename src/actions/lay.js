export const setLaySelected = () => ({
  type: 'SET_LAY_SELECTED',
});

export const setStake = (stake) => ({
  type: 'SET_LAY_STAKE',
  payload: stake,
});

export const setPrice = (price) => ({
  type: 'SET_LAY_PRICE',
  payload: price,
});

export const setHours = (hours) => ({
  type: 'SET_LAY_HOURS',
  payload: hours,
});

export const setMinutes = (minutes) => ({
  type: 'SET_LAY_MINUTES',
  payload: minutes,
});

export const setSeconds = (seconds) => ({
  type: 'SET_LAY_SECONDS',
  payload: seconds,
});

export const toggleExecutionTime = (executionTime) => ({
  type: 'TOGGLE_LAY_EXECUTION_BEFORE_OR_AFTER',
  payload: executionTime,
});

export const setDisplayText = (text) => ({
  type: 'SET_LAY_TEXT',
  payload: text,
});

export const setSelections = (selections) => ({
  type: 'SET_LAY_SELECTIONS',
  payload: selections,
});

export const updateLayList = (list) => ({
  type: 'UPDATE_LAY_LIST',
  payload: list,
});

export const addLayBet = (data) => ({
  type: 'ADD_LAY_BET',
  payload: data,
});

export const removeLayBet = (data) => ({
  type: 'REMOVE_LAY_BET',
  payload: data,
});

export const removeAllSelectionLayBets = (data) => ({
  type: 'REMOVE_ALL_SELECTION_LAY_BETS',
  payload: data,
});

export const removeAllLayBets = () => ({
  type: 'REMOVE_ALL_LAY_BETS',
});
