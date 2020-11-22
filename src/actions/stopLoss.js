export const setStopLossSelected = () => ({
  type: 'SET_STOP_LOSS_SELECTED',
});

export const setStopLossOffset = (offset) => ({
  type: 'SET_STOP_LOSS_OFFSET',
  payload: offset,
});

export const setStopLossUnit = (unit) => ({
  type: 'SET_STOP_LOSS_UNITS',
  payload: unit,
});

export const toggleStopLossTrailing = (selected) => ({
  type: 'TOGGLE_STOP_LOSS_TRAILING',
  payload: selected,
});
export const toggleStopLossHedged = (selected) => ({
  type: 'TOGGLE_STOP_LOSS_HEDGED',
  payload: selected,
});

export const setDisplayText = (text) => ({
  type: 'SET_STOP_LOSS_TEXT',
  payload: text,
});

export const updateStopLossList = (list) => ({
  type: 'UPDATE_STOP_LOSS_LIST',
  payload: list,
});

export const setSelections = (selections) => ({
  type: 'SET_STOP_LOSS_SELECTIONS',
  payload: selections,
});

export const addStopLoss = (data) => ({
  type: 'ADD_STOP_LOSS',
  payload: data,
});

export const removeStopLoss = (data) => ({
  type: 'REMOVE_STOP_LOSS',
  payload: data,
});
