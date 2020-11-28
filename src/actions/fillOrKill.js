export const setFillOrKillSelected = () => ({
  type: 'SET_FILL_OR_KILL_SELECTED',
});

export const setFillOrKill = (seconds) => ({
  type: 'SET_FILL_OR_KILL_TIME',
  payload: seconds,
});

export const setDisplayText = (text) => ({
  type: 'SET_FILL_OR_KILL_TEXT',
  payload: text,
});

export const updateFillOrKillList = (list) => ({
  type: 'UPDATE_FILL_OR_KILL_LIST',
  payload: list,
});

export const addFillOrKill = (data) => ({
  type: 'ADD_FILL_OR_KILL',
  payload: data,
});

export const removeFillOrKill = (data) => ({
  type: 'REMOVE_FILL_OR_KILL',
  payload: data,
});

export const removeAllFillOrKill = () => ({
  type: 'REMOVE_ALL_FILL_OR_KILL',
});
