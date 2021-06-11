export const setTickOffsetSelected = () => ({
  type: 'SET_TICK_OFFSET_SELECTED',
});

export const setTicks = (ticks) => ({
  type: 'SET_TICK_OFFSET_TICKS',
  payload: ticks,
});

export const setUnit = (unit) => ({
  type: 'SET_TICK_OFFSET_UNIT',
  payload: unit,
});

export const setPercentTrigger = (percent) => ({
  type: 'SET_TICK_OFFSET_PERCENT_TRIGGER',
  payload: percent,
});

export const setHedged = (selected) => ({
  type: 'TOGGLE_TICK_OFFSET_HEDGED',
  payload: selected,
});

export const setDisplayText = (text) => ({
  type: 'SET_TICK_OFFSET_TEXT',
  payload: text,
});

export const updateTickOffsetList = (list) => ({
  type: 'UPDATE_TICK_OFFSET_LIST',
  payload: list,
});

export const addTickOffset = (data) => ({
  type: 'ADD_TICK_OFFSET',
  payload: data,
});

export const removeTickOffset = (data) => ({
  type: 'REMOVE_TICK_OFFSET',
  payload: data,
});

export const removeTickOffsetOnSide = (data) => ({
  type: 'REMOVE_TICK_OFFSET_ON_SIDE',
  payload: data,
});

export const removeAllTickOffset = () => ({
  type: 'REMOVE_ALL_TICK_OFFSET',
});

export const updateTickOffsetBetPrice = (data) => ({
  type: 'UPDATE_TICK_OFFSET_BET_PRICE',
  payload: data,
});
