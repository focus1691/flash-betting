export const setFillOrKillSelected = (isSelected) => ({
  type: 'SET_FILL_OR_KILL_SELECTED',
  payload: isSelected,
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

export const removeFillOrKillOrder = (order) => ({
  type: 'REMOVE_FILL_OR_KILL_ORDER',
  payload: order,
});
