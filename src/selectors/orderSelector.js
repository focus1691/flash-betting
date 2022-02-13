import { createSelector } from 'reselect';

export const getUnmatchedBets = createSelector((bets) => bets, (bets) => bets.unmatched);
export const getMatchedBets = createSelector((bets) => bets, (bets) => bets.matched);

const getMarketMatchedBetsSelector = (bets, { marketId }) => ({ bets: bets.matched, marketId });
export const getMarketMatchedBets = createSelector(getMarketMatchedBetsSelector, ({ bets, marketId }) => Object.values(bets).filter((bet) => (parseInt(bet.marketId) === parseInt(marketId))));

const getMarketUnmatchedBetsSelector = (bets, { marketId }) => ({ bets: bets.unmatched, marketId });
export const getMarketUnmatchedBets = createSelector(getMarketUnmatchedBetsSelector, ({ bets, marketId }) => Object.values(bets).filter((bet) => bet.marketId == marketId));

const getSelectionUnmatchedBetsSelector = (bets, { selectionId }) => ({ bets: bets.unmatched, selectionId });
export const getSelectionUnmatchedBets = createSelector(getSelectionUnmatchedBetsSelector, ({ bets, selectionId }) => Object.values(bets).filter((bet) => bet.selectionId == selectionId));

const getSelectionMatchedBetsSelector = (bets, { selectionId }) => ({ bets: bets.matched, selectionId });
export const getSelectionMatchedBets = createSelector(getSelectionMatchedBetsSelector, ({ bets, selectionId }) => Object.values(bets).filter((bet) => (parseInt(bet.selectionId) === parseInt(selectionId))));

// The unmatched bets on a Ladder Row given by selectionId and price
const getUnmatchedBetsOnRowSelector = (bets, { selectionId, price, side }) => ({ unmatched: bets.unmatched, selectionId, price, side });
export const getUnmatchedBetsOnRow = createSelector(getUnmatchedBetsOnRowSelector, ({
  unmatched, selectionId, price, side,
}) => {
  if (unmatched) {
    const unmatchedBets = Object.values(unmatched).filter((bet) => bet.selectionId == selectionId && parseFloat(bet.price) == parseFloat(price) && bet.side === side);
    return unmatchedBets.length > 0 ? unmatchedBets : [];
  }
  return [];
});

// export getMatchedBet = createSelector(Function, ({ }))