export const setStopEntrySelected = () => ({
  type: 'SET_STOP_ENTRY_SELECTED',
});

export const setLTPOperator = (operator) => ({
  type: 'SET_STOP_ENTRY_OPERATOR',
  payload: operator,
});

export const setTargetLTP = (ltpTarget) => ({
  type: 'SET_TARGET_LTP',
  payload: ltpTarget,
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

export const addStopEntryBet = (data) => ({
  type: 'ADD_STOP_ENTRY_BET',
  payload: data,
});

export const placeStopEntryBet = (data) => ({
  type: 'PLACE_STOP_ENTRY_BET_SAGA',
  payload: data,
});

export const removeStopEntryBet = (data) => ({
  type: 'REMOVE_STOP_ENTRY_BET',
  payload: data,
});

export const removeStopEntryBetsOnSide = (data) => ({
  type: 'REMOVE_STOP_ENTRY_BETS_ON_SIDE',
  payload: data,
});

export const removeMultiSelectionStopEntryBets = (data) => ({
  type: 'REMOVE_MULTI_SELECTION_STOP_ENTRY_BETS',
  payload: data,
});

export const removeAllSelectionStopEntryBets = (data) => ({
  type: 'REMOVE_ALL_SELECTION_STOP_ENTRY_BETS',
  payload: data,
});


export const removeAllStopEntryBets = () => ({
  type: 'REMOVE_ALL_STOP_ENTRY_BETS',
});

export const updateStopEntryBetPrice = (data) => ({
  type: 'UPDATE_STOP_ENTRY_BET_PRICE',
  payload: data,
});