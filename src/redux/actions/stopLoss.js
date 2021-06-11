import { removeBet, updateStoredStopLoss } from '../../http/dbHelper';

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

export const updateStopLossList = (list) => ({
  type: 'UPDATE_STOP_LOSS_LIST',
  payload: list,
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

export const setStopLossBetMatched = (data) => ({
  type: 'SET_STOP_LOSS_BET_MATCHED',
  payload: data,
});

export const replaceStopLoss = async (SL, { selectionId, stakeVal, price, side, stopLossUnits, stopLossHedged }) => {
  return async (dispatch) => {
    if (SL) {
      side = side.toUpperCase();
      //* Just remove it if the stop loss position is clicked
      if (SL.price == price && SL.side == side) {
        removeBet({ rfs: SL.rfs });
        dispatch(removeStopLoss({ selectionId }));
      } else {
        //* Change the stop position otherwise
        removeBet({ rfs: SL.rfs });
        const newStopLoss = {
          rfs: SL.rfs,
          size: stakeVal,
          price,
          units: stopLossUnits,
          custom: true,
          assignedIsOrderMatched: false,
          tickOffset: 0,
          hedged: stopLossHedged,
        };
        updateStoredStopLoss(newStopLoss);
        dispatch(updateStopLoss(newStopLoss));
      }
    }
  }
};

export const removeAllStopLoss = () => ({
  type: 'REMOVE_ALL_STOP_LOSS',
});

export const updateStopLossBetPrice = (data) => ({
  type: 'UPDATE_STOP_LOSS_BET_PRICE',
  payload: data,
});

export const updateStopLossTicks = (data) => ({
  type: 'UPDATE_STOP_LOSS_TICKS',
  payload: data,
});
