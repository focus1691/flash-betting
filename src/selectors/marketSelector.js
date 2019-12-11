import { createSelector } from 'reselect'

const getLadderSelector = (state, {selectionId}) => state[selectionId]

const getRunnerSelector = (state, {selectionId}) => state[selectionId]

export const getSportId = createSelector(
    state => state,
    state => state.eventType.id
)

export const getRunner = createSelector(
    getRunnerSelector,
    runner => runner
)

export const getLadder = createSelector(
    getLadderSelector,
    ladder => ladder
)

export const getLTP = createSelector(
    getLadderSelector,
    ladder => ladder.ltp
)

export const getLTPDelta = createSelector(
    getLadderSelector,
    ladder => ladder.ltpDelta
)

const getLadderMatchedSelector = (state, {selectionId, side, price}) => ({matched: state[selectionId][side == "BACK" ? 'atbo' : 'atlo'][price], side: side})

export const getMatched = createSelector(
    getLadderMatchedSelector,
    ({matched, side}) => ({
        matched: matched ? matched : null,
        side: side,
    })
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
