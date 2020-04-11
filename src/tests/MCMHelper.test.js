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
        
        expect(stopLossCheck(stopLossList[237470], 26)).toBeTruthy();
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
              "side": "BACK",
              "size": 5,
              "price": "38",
              "rfs": '3423423fedjafi',
              "betId": "4235115",
              "tickOffset": 5
            },
        }
        expect(stopLossCheck(stopLossList[237470], 35).targetMet).toStrictEqual(false);
        expect(stopLossCheck(stopLossList[237470], 40).targetMet).toStrictEqual(false);
        expect(stopLossCheck(stopLossList[237470], 48).targetMet).toBeTruthy();
    })
})
