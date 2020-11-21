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

export const removeTickOffset = (data) => ({
  type: 'REMOVE_TICK_OFFSET',
  payload: data,
});
