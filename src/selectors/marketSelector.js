import { createSelector } from 'reselect'

const getLadderSelector = (state, {selectionId}) => state[selectionId]

export const getLTP = createSelector(
    getLadderSelector,
    ladder => ladder.ltp
)

export const getLTPDelta = createSelector(
    getLadderSelector,
    ladder => ladder.ltpDelta
)

export const getTV = createSelector(
    getLadderSelector,
    ladder => ladder.tv[0]? ladder.tv[0].toLocaleString()
    : ""
)

export const getPercent = createSelector(
    getLadderSelector,
    ladder => ladder.percent
)
