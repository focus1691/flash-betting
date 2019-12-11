import { createSelector } from 'reselect'

export const getUnmatchedBets = createSelector(
    state => state,
    state => state.unmatched
)

export const getMatchedBets = createSelector(
    state => state,
    state => state.matched
)