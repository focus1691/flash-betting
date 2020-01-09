import { stopEntryListChange, stopLossTrailingChange, stopLossCheck } from '../utils/ExchangeStreaming/MCMHelper'
import { checkTimeListAfter } from '../utils/TradingStategy/BackLay';
import { calcHedgedPL2 } from '../utils/TradingStategy/HedingCalculator';
import data from './MCMHelperData.json'
import { UpdateLadder } from '../utils/ladder/UpdateLadder';
import CalculateLadderHedge from '../utils/ladder/CalculateLadderHedge';
import { CreateLadder } from '../utils/ladder/CreateLadder';

test('mcm should go through all strategies', async () => {

    const ladders = {};
    const nonRunners = {};

    const backList = {
        "10141729": [
          {
            "strategy": "Back",
            "marketId": "1.160741054",
            "selectionId": 2411840,
            "executionTime": "After",
            "timeOffset": 40,
            "size": 2,
            "price": "750",
            "rfs": "2e462488be946f0"
          }
        ]
    };
    const laylist = {};
    const matchedBets = {};
    const unmatchedBets = {};
    const stopEntryList = {
        "10141729": [
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
            "stopEntryCondition": ">",
            "side": "BACK",
            "size": 2,
            "price": "750",
            "rfs": "b1ed192c6870738"
          }
        ],
    }

    const stopLossList = {
        "10141729": {
          "strategy": "Stop Loss",
          "trailing": false,
          "hedged": true,
          "assignedIsOrderMatched": true,
          "units": "Ticks",
          "_id": "5d96d43809bd2142c4321f37",
          "marketId": "1.159700186",
          "selectionId": 10141729,
          "side": "LAY",
          "size": 5,
          "price": "38",
          "rfs": "1e4786863a6577c",
          "betId": "4235115",
          "tickOffset": 5
        },
    }

    let adjustedStopLossList = Object.assign({}, stopLossList)
    const adjustedBackList = {}
    const adjustedLayList = {}
    let newStopEntryList = Object.assign({}, stopEntryList);

    let stopLossOrdersToRemove = [];

    const marketId = "1.160741054";

    data.rc.map(rc => {
        ladders[rc.id] = CreateLadder(rc)
    });
    
    await Promise.all(data.rc.map(async rc => {

        if (rc.id in ladders) {
            // Runner found so we update our object with the raw data
            ladders[rc.id] = UpdateLadder(ladders[rc.id], rc);

            const currentLTP = ladders[rc.id].ltp[0]

            // stop Entry
            newStopEntryList = stopEntryListChange(stopEntryList, rc.id, currentLTP, () => {}, newStopEntryList, unmatchedBets, matchedBets);
            // We increment and check the stoplosses
            if (stopLossList[rc.id] !== undefined) {
                
                // if it's trailing and the highest LTP went up, then we add a tickoffset
                const maxLTP = ladders[rc.id].ltp.sort((a, b) => b - a)[0];
                let adjustedStopLoss = Object.assign({}, stopLossTrailingChange(stopLossList, rc.id, currentLTP, maxLTP));

                // if hedged, get size (price + hedged profit/loss)
                if (adjustedStopLoss.hedged) {
                    const newMatchedBets = Object.values(matchedBets).filter(bet => parseFloat(bet.selectionId) === parseFloat(adjustedStopLoss.selectionId));

                    adjustedStopLoss.size = CalculateLadderHedge(parseFloat(adjustedStopLoss.price), newMatchedBets, 'hedged').size
                }

                // if it doesn't have a reference or the order has been matched (STOP LOSS)
                const stopLossMatched = stopLossCheck(adjustedStopLoss, rc.id, currentLTP, () => {}, stopLossOrdersToRemove, adjustedStopLossList, unmatchedBets, matchedBets);
                
                adjustedStopLossList = stopLossMatched.adjustedStopLossList;
                stopLossOrdersToRemove = stopLossMatched.stopLossOrdersToRemove;
            }
            else if (rc.id in nonRunners === false) {
                // Runner found so we create the new object with the raw data
                ladders[rc.id] = CreateLadder(rc);
            }
        }
    }));

    expect(Object.keys(stopLossOrdersToRemove).length).toBe(1)
    expect(Object.keys(newStopEntryList).length).toBe(0)
    expect(Object.keys(adjustedBackList).length).toBe(0)
})

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
