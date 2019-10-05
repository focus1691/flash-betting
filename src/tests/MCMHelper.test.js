import { stopEntryListChange, stopLossTrailingChange, stopLossCheck } from '../utils/MCMHelper'

describe('stopEntryList changes depending on LTP', () => {
    const stopEntryList = {
        "237484": [
          {
            "strategy": "Stop Entry",
            "trailing": false,
            "hedged": false,
            "assignedIsOrderMatched": false,
            "units": "Ticks",
            "_id": "5d96c7434540aca56014613c",
            "marketId": "1.159700186",
            "selectionId": 237484,
            "targetLTP": 3,
            "stopEntryCondition": "<",
            "side": "BACK",
            "size": 2,
            "price": "750",
            "rfs": "b1ed192c6870738"
          }
        ],
    }
    const onPlaceOrder = () => {}

    test('LTP fits the condition', () => {
        expect.assertions(0)
        try {
            expect(stopEntryListChange(stopEntryList, 237484, 2, onPlaceOrder, stopEntryList)).resolves.toEqual({})
        } catch (e) {
            expect(e.error).toEqual('StopEntryCheck failed.');
        }
        
    })

    test('LTP doesn\'t fit the condition', () => {
        expect.assertions(1)
        try {
            expect(stopEntryListChange(stopEntryList, 237484, 4, onPlaceOrder, stopEntryList)).resolves.toStrictEqual(stopEntryList)
        } catch (e) {
            expect(e.error).toEqual('StopEntryCheck failed.');
        }
    })
})


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

describe('check if stoploss works', () => {
    
    const onPlaceOrder = () => {}
    test('no order attached to it: rfs == undefined', () => {
        const stopLossList = {
            237470: {
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
              "rfs": undefined,
              "betId": "4235115",
              "tickOffset": 5
            },
        }   
        
        expect(stopLossCheck(stopLossList[237470], 237470, 26, onPlaceOrder, [], stopLossList)).toStrictEqual({
            adjustedStopLossList: {},
            stopLossOrdersToRemove: [stopLossList[237470]],
        })
    })

    test('order attached to it, assignedOrder is not matched: rfs == 3423423fedjafi', () => {
        const stopLossList = {
            237470: {
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
              "rfs": '3423423fedjafi',
              "betId": "4235115",
              "tickOffset": 5
            },
        }   
        expect(stopLossCheck(stopLossList[237470], 237470, 26, onPlaceOrder, [], stopLossList)).toStrictEqual({
            adjustedStopLossList: {237470: stopLossList[237470]},
            stopLossOrdersToRemove: [],
        })
    })

    test('order attached to it: rfs == 3423423fedjafi', () => {
        const stopLossList = {
            237470: {
              "strategy": "Stop Loss",
              "trailing": true,
              "hedged": false,
              "assignedIsOrderMatched": true,
              "units": "Ticks",
              "_id": "5d96d43809bd2142c4321f37",
              "marketId": "1.159700186",
              "selectionId": 237470,
              "side": "LAY",
              "size": 5,
              "price": "38",
              "rfs": '3423423fedjafi',
              "betId": "4235115",
              "tickOffset": 5
            },
        }   
        expect(stopLossCheck(stopLossList[237470], 237470, 26, onPlaceOrder, [], stopLossList)).toStrictEqual({
            adjustedStopLossList: {},
            stopLossOrdersToRemove: [stopLossList[237470]],
        })
    })
})
