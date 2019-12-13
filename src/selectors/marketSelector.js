import { createSelector } from 'reselect'
import GetColoredLTPList from '../utils/ladder/GetColoredLTPList'

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

const getLTPCheckerSelector = (state, {selectionId, price}) => parseFloat(state[selectionId].ltp[0]) === parseFloat(price)

export const getIsLTP = createSelector(
    getLTPCheckerSelector,
    isLTP => isLTP
)

const getLadderCandleStickSelector = (state, {selectionId, price}) => ({ladder: state[selectionId], price: price})

export const getCandleStickColor = createSelector(
    getLadderCandleStickSelector,
    ({ladder, price}) => { 
        const coloredLTPList = GetColoredLTPList(ladder);
        const ltpIndex = coloredLTPList.findIndex(item => parseFloat(item.tick) === parseFloat(price))

        if (ltpIndex === -1) return undefined
        return {index: ltpIndex, color: coloredLTPList[ltpIndex]}
    }
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

const getLadderVolumeSelector = (state, {selectionId, price}) => state[selectionId].trdo[price]

export const getVolume = createSelector(
    getLadderVolumeSelector,
    volume => volume ? Math.floor(volume / 100) / 10 : undefined
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
