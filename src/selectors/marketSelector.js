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

const getPLSelector = (state, {selectionId}) => state[selectionId]

export const getPL = createSelector(
    getPLSelector,
    pl => pl
)

const getLTPCheckerSelector = (state, {selectionId, price}) => parseFloat(state[selectionId].ltp[0]) === parseFloat(price)

export const getIsLTP = createSelector(
    getLTPCheckerSelector,
    isLTP => isLTP
)

const getVolumeLTP = (state, {selectionId, price}) => ({trd: state[selectionId].trd, trdo: state[selectionId].trdo[formatPriceKey(price)]})

export const getVolumeDivider = createSelector(
    getVolumeLTP, // Math.floor(trdo / 100) / 10: turns 100 vol into 0.1, then we divide it by 10 to make it look better, then we divide it by the fraction to find the percentage
    ({trd, trdo}) => trd && trdo ? Math.floor(trdo / 100) / 10 / GetVolumeFraction(trd) : undefined
)

const getLadderCandleStickSelector = (state, {selectionId, price}) => ({ladder: state[selectionId], price: price})

export const getCandleStickColor = createSelector(
    getLadderCandleStickSelector,
    ({ladder, price}) => { 
        const coloredLTPList = GetColoredLTPList(ladder);
        const ltpIndexes = coloredLTPList.map((item, index) => {
            if (parseFloat(item.tick) === parseFloat(price)) {
                return Object.assign({}, item, {index})
            }
            return undefined;
        }).filter(item => item !== undefined)
        

        if (ltpIndexes.length === 0) return []
        return ltpIndexes.map(item => ({index: item.index, color: item.color}))
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
    getLadderVolumeSelector, // Math.floor(trdo / 100) / 10: turns 100 vol into 0.1, then we divide it by 10 to make it look better, 
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
