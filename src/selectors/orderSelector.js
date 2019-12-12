import { createSelector } from 'reselect'

export const getUnmatchedBets = createSelector(
    state => state,
    state => state.unmatched
)

export const getMatchedBets = createSelector(
    state => state,
    state => state.matched
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