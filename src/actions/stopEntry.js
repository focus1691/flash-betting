export const setStopEntrySelected = (isSelected) => ({
  type: 'SET_STOP_ENTRY_SELECTED',
  payload: isSelected,
});

export const setLTPOperator = (operator) => ({
  type: 'SET_STOP_ENTRY_OPERATOR',
  payload: operator,
});

export const setTicks = (ticks) => ({
  type: 'SET_STOP_ENTRY_TICKS',
  payload: ticks,
});

export const setStake = (stake) => ({
  type: 'SET_STOP_ENTRY_STAKE',
  payload: stake,
});

export const setPrice = (price) => ({
  type: 'SET_STOP_ENTRY_PRICE',
  payload: price,
});

export const setSide = (side) => ({
  type: 'SET_STOP_ENTRY_SIDE',
  payload: side,
});

export const updateStopEntryList = (list) => ({
  type: 'UPDATE_STOP_ENTRY_LIST',
  payload: list,
});

export const setSelections = (selections) => ({
  type: 'SET_STOP_ENTRY_SELECTIONS',
  payload: selections,
});

export const removeStopEntryOrder = (order) => ({
  type: 'REMOVE_STOP_ENTRY_ORDER',
  payload: order,
});
