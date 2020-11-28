import { removeBet, updateStoredStopLoss } from '../http/helper';

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

export const updateStopLoss = (list) => ({
  type: 'REPLACE_STOP_LOSS',
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

export const removeStopLossOnSide = (data) => ({
  type: 'REMOVE_STOP_LOSS_ON_SIDE',
  payload: data,
});

export const replaceStopLoss = async (SL, stopLossList, data) => {
  return async (dispatch) => {
    //* Just remove it if the stop loss position is clicked
    if (SL && SL.stopLoss) {
      removeBet({ rfs: stopLossList[data.selectionId].rfs });
      dispatch(removeStopLoss({ selectionId: data.selectionId }));
    }
    //* Change the stop position otherwise
    else if (stopLossList[data.selectionId]) {
      removeBet({ rfs: stopLossList[data.selectionId].rfs });
      const SL = {
        rfs: stopLossList[data.selectionId].rfs,
        size: data.stakeVal,
        price: data.price,
        units: data.stopLossUnits,
        custom: true,
        assignedIsOrderMatched: false,
        tickOffset: 0,
        hedged: data.stopLossHedged,
      };
      updateStoredStopLoss(SL);
      dispatch(updateStopLoss(SL));
    }
  };
};

export const removeAllStopLoss = () => ({
  type: 'REMOVE_ALL_STOP_LOSS',
});
