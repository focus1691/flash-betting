import { createSelector } from 'reselect';

const getLastTradedPriceSelector = (state, { selectionId }) => state[selectionId] ? state[selectionId].ltp : [];
export const getLadderLTPs = createSelector(getLastTradedPriceSelector, (ltps) => ltps);

const isPriceLastTradedSelector = (state, { selectionId, price }) => state[selectionId] && state[selectionId].ltp[0] == price;
export const isPriceLastTraded = createSelector(isPriceLastTradedSelector, (isLTP) => isLTP);
