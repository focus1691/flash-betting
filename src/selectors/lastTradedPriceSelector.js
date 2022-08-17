import { createSelector } from 'reselect';

const getLastTradedPriceSelector = (state, selectionId) => state[selectionId] ? state[selectionId].ltp : [];
export const getLadderLTPs = createSelector(getLastTradedPriceSelector, (ltps) => ltps);
