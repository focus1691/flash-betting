import { createSelector } from 'reselect'

const getStakeSelector = (state, {selectionId}) => state[selectionId]

export const getStakeVal = createSelector(
    getStakeSelector,
    state => state
)
