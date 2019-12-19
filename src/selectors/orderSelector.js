import { createSelector } from 'reselect'

export const getUnmatchedBets = createSelector(
    state => state,
    state => state.unmatched
)

export const getMatchedBets = createSelector(
    state => state,
    state => state.matched
)

const getSelectionMatchedBetsSelector = (state, {selectionId}) => ({bets: state.matched, selectionId: selectionId})

export const getSelectionMatchedBets = createSelector(
    getSelectionMatchedBetsSelector,
    ({bets, selectionId}) => {
        return Object.values(bets).filter(bet => {
            if (parseInt(bet.selectionId) === parseInt(selectionId))
                return true;
        });
    }
)


const getUnmatchedBetOnRowSelector = (state, {selectionId, price}) => ({unmatched: state.unmatched, selectionId: selectionId, price: price})

export const getUnmatchedBetOnRow = createSelector(
    getUnmatchedBetOnRowSelector,
    ({unmatched, selectionId, price}) => {
        if (unmatched) {
            return Object.values(unmatched).find(bet => bet.selectionId == selectionId && parseFloat(bet.price) == parseFloat(price))
        } else {
            return undefined
        }
        
    }
)