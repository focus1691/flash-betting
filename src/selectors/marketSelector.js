import { createSelector } from 'reselect';
import { formatPriceKey } from '../utils/Bets/PriceCalculations';

const getLadderSelector = (state, { selectionId }) => state[selectionId];

const getRunnerSelector = (state, { selectionId }) => state[selectionId];

export const getSportId = createSelector((state) => state, (state) => state.id);

export const getRunner = createSelector(getRunnerSelector, (runner) => runner);

export const getLadder = createSelector(getLadderSelector, (ladder) => ladder);

export const getLTP = createSelector(getLadderSelector, (ladder) => ((ladder && ladder.ltp) ? ladder.ltp : null));

const getPLSelector = (state, { selectionId }) => state[selectionId];

export const getPL = createSelector(getPLSelector, (pl) => pl);

const getLTPCheckerSelector = (state, { selectionId, price }) => state[selectionId].ltp[0] == price;

export const getIsLTP = createSelector(getLTPCheckerSelector, (isLTP) => isLTP);

const getLadderUnmatchedSelector = (ladder, { selectionId, side, price }) => ({ matched: ladder[selectionId][side == 'BACK' ? 'atbo' : 'atlo'][formatPriceKey(price)], side });

export const getUnmatched = createSelector(
  getLadderUnmatchedSelector,
  ({ matched, side }) => ({
    matched: matched || null,
    side,
  }),
);

const getLadderMatchedSelector = (ladder, { selectionId, price, side }) => ({ matched: ladder[selectionId].matched, price, side });

export const getMatched = createSelector(
  getLadderMatchedSelector,
  ({ matched, price, side }) => (
    matched && matched.price === price && matched.side === side ? matched.amount : null
  ),
);

export const getTV = createSelector(
  getLadderSelector,
  (ladder) => ((ladder && ladder.tv[0]) ? ladder.tv[0].toLocaleString()
    : ''),
);

export const getPercent = createSelector(
  getLadderSelector,
  (ladder) => ((ladder && ladder.percent) ? ladder.percent : null),
);
