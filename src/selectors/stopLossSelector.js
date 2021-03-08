import { createSelector } from 'reselect';

const getStopLossSelector = (stopLossList, { selectionId }) => ({
  stopLoss: stopLossList[selectionId],
});

export const getStopLoss = createSelector(getStopLossSelector, ({ stopLoss }) => stopLoss);
