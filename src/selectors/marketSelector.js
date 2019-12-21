import { createSelector } from 'reselect'
import GetColoredLTPList from '../utils/ladder/GetColoredLTPList'
import GetVolumeFraction from '../utils/ladder/GetVolumeFraction'
import { formatPriceKey } from '../utils/ladder/CreateFullLadder'


const getLadderSelector = (state, {selectionId}) => {
    return state[selectionId]
}

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
    ladder => (ladder && ladder.ltp) ? ladder.ltp : null
)

const getLTPCheckerSelector = (state, {selectionId, price}) => parseFloat(state[selectionId].ltp[0]) === parseFloat(price)

export const getIsLTP = createSelector(
    getLTPCheckerSelector,
    isLTP => isLTP
)

const getVolumeLTP = (state, {selectionId}) => state[selectionId].trd

export const getVolumeDivider = createSelector(
    getVolumeLTP,
    trd => trd ? GetVolumeFraction(trd) : undefined
)

const getLadderCandleStickSelector = (state, {selectionId, price}) => ({ladder: state[selectionId], price: price})

export const getCandleStickColor = createSelector(
    getLadderCandleStickSelector,
    ({ladder, price}) => { 
        const coloredLTPList = GetColoredLTPList(ladder);
        const ltpIndex = coloredLTPList.findIndex(item => parseFloat(item.tick) === parseFloat(price))

        if (ltpIndex === -1) return undefined
        return {index: ltpIndex, color: coloredLTPList[ltpIndex].color}
    }
)

export const getLTPDelta = createSelector(
    getLadderSelector,
    ladder => (ladder && ladder.ltpDelta) ? ladder.ltpDelta : null
)

const getLadderMatchedSelector = (state, {selectionId, side, price}) => ({matched: state[selectionId][side == "BACK" ? 'atbo' : 'atlo'][formatPriceKey(price)], side: side})

export const getMatched = createSelector(
    getLadderMatchedSelector,
    ({matched, side}) => ({
        matched: matched ? matched : null,
        side: side,
    })
)

const getLadderVolumeSelector = (state, {selectionId, price}) => state[selectionId].trdo[formatPriceKey(price)]

export const getVolume = createSelector(
    getLadderVolumeSelector,
    volume => volume ? Math.floor(volume / 100) / 10 : undefined
)

export const getTV = createSelector(
    getLadderSelector,
    ladder => (ladder && ladder.tv[0]) ? ladder.tv[0].toLocaleString()
    : ""
)

export const getPercent = createSelector(
    getLadderSelector,
    ladder => (ladder && ladder.percent) ? ladder.percent : null
)
