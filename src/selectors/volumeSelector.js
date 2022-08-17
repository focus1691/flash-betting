import { createSelector } from 'reselect';
import { formatPriceKey } from '../utils/Bets/PriceCalculations';

const getLadderVolumeSelector = (state, { selectionId, price }) => state[selectionId].trdo[formatPriceKey(price)];

export const getVolumeFractional = createSelector(getLadderVolumeSelector, (volume) => {
  volume = Math.floor(volume / 100) / 10;
  return volume && volume > 0 ? volume : null;
});
