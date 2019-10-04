import { stopLossTrailingChange } from '../utils/MCMHelper'

describe('tickOffset increase when newLTP > oldLadderLTP', () => {
    const stopLossList = {
        "237470": {
          "strategy": "Stop Loss",
          "trailing": true,
          "hedged": false,
          "assignedIsOrderMatched": false,
          "units": "Ticks",
          "_id": "5d96d43809bd2142c4321f37",
          "marketId": "1.159700186",
          "selectionId": 237470,
          "side": "LAY",
          "size": 5,
          "price": "38",
          "rfs": "1e4786863a6577c",
          "betId": "4235115",
          "tickOffset": 5
        },
    }

    test('stoploss should increase when newLTP > oldLadderLTP', () => {     
        expect(stopLossTrailingChange(stopLossList, 237470, 5, 4)).toStrictEqual(Object.assign({}, stopLossList['237470'], {tickOffset: 6}))
    })

    test('stoploss should stay the same when newLTP == oldLadderLTP', () => { 
        expect(stopLossTrailingChange(stopLossList, 237470, 4, 4)).toStrictEqual(Object.assign({}, stopLossList['237470'], {tickOffset: 5}))
    })

    test('stoploss should stay the same when newLTP < oldLadderLTP', () => { 
        expect(stopLossTrailingChange(stopLossList, 237470, 3, 4)).toStrictEqual(Object.assign({}, stopLossList['237470'], {tickOffset: 5}))
    })
})


