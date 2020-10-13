export const setBackSelected = () => ({
  type: 'SET_BACK_SELECTED',
});

export const setStake = (stake) => ({
  type: 'SET_BACK_STAKE',
  payload: stake,
});

export const setPrice = (price) => ({
  type: 'SET_BACK_PRICE',
  payload: price,
});

export const setHours = (hours) => ({
  type: 'SET_BACK_HOURS',
  payload: hours,
});

export const setMinutes = (minutes) => ({
  type: 'SET_BACK_MINUTES',
  payload: minutes,
});

export const setSeconds = (seconds) => ({
  type: 'SET_BACK_SECONDS',
  payload: seconds,
});

export const toggleExecutionTime = (executionTime) => ({
  type: 'TOGGLE_BACK_EXECUTION_BEFORE_OR_AFTER',
  payload: executionTime,
});

export const setDisplayText = (text) => ({
  type: 'SET_BACK_TEXT',
  payload: text,
});

export const setSelections = (selections) => ({
  type: 'SET_BACK_SELECTIONS',
  payload: selections,
});

export const updateBackList = (list) => ({
  type: 'UPDATE_BACK_LIST',
  payload: list,
});

export const removeBackOrder = (order) => ({
  type: 'REMOVE_BACK_ORDER',
  payload: order,
});
