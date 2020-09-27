import { createSelector } from 'reselect';

const getTickOffsetSelector = (tickOffset, { refs, price, side }) => ({
  tickOffset: tickOffset[refs],
  price,
  side,
});

export const getTickOffset = createSelector(getTickOffsetSelector, ({ tickOffset, price, side }) => {
  if (!tickOffset) return undefined;
});
