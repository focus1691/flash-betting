import { checkStopLossForMatch, checkTickOffsetForMatch } from '../utils/ExchangeStreaming/OCMHelper';

test('ocm should go through all strategies', () => {
    const ocmData = {
        "op": "ocm",
        "id": 6,
        "initialClk": "GpOH0JwBH762w50BHKKomJ0BGpzR5ZoBH5mWsJwB",
        "clk": "AAAAAAAAAAAAAA==",
        "conflateMs": 0,
        "heartbeatMs": 5000,
        "pt": 1468943673782,
        "ct": "SUB_IMAGE",
        "oc": [{
            "id": "1.125657760",
            "orc": [{
                "fullImage": true,
                "id": "60424",
                "uo": [{
                    "id": "71352090695",
                    "p": 12,
                    "s": 5,
                    "side": "B",
                    "status": "E",
                    "pt": "L",
                    "ot": "L",
                    "pd": 1468919099000,
                    "md": 1468933833000,
                    "avp": 12,
                    "sm": 4.75,
                    "sr": 0.1,
                    "sl": 0,
                    "sc": 0,
                    "sv": 0,
                    "rfs": "ff737fe8398735b"
                }],
                "mb": [
                    [12, 4.75]
                ]
            }]
        }, {
            "id": "1.125657760",
            "orc": [{
                "fullImage": true,
                "id": "237470",
                "uo": [{
                    "id": "71352090695",
                    "p": 12,
                    "s": 5,
                    "side": "B",
                    "status": "E",
                    "pt": "L",
                    "ot": "L",
                    "pd": 1468919099000,
                    "md": 1468933833000,
                    "avp": 12,
                    "sm": 4.75,
                    "sr": 0,
                    "sl": 0,
                    "sc": 0,
                    "sv": 0,
                    "rfs": "1e4786863a6577c"
                }],
                "mb": [
                    [12, 4.75]
                ]
            }]
        }]
    };

    const unmatchedBets = {};
    const matchedBets = {};
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
    const tickOffsetList = {
        "ff737fe8398735b": {
            "strategy": "Tick Offset",
            "trailing": false,
            "hedged": false,
            "assignedIsOrderMatched": false,
            "units": "Ticks",
            "_id": "5d96cd2fb1d4f6b0a01f1c55",
            "marketId": "1.159700186",
            "selectionId": 60424,
            "price": "810",
            "size": 5,
            "side": "BACK",
            "percentageTrigger": 2,
            "rfs": "ff737fe8398735b",
            "betId": "4235115"
        },
    }

    const newUnmatchedBets = Object.assign({}, unmatchedBets)
    const newMatchedBets = Object.assign({}, matchedBets);
    let checkForMatchInStopLoss = Object.assign({}, stopLossList)
    let checkForMatchInTickOffset = Object.assign({}, tickOffsetList)
    let tickOffsetOrdersToRemove = [];

    ocmData.oc.map(changes => {
        changes.orc.map(runner => {
            if (runner.uo) {
                runner.uo.map(order => {
                    // If the bet isn't in the unmatchedBets, we should delete it.

                    if (newUnmatchedBets[order.id] !== undefined) {
                        delete newUnmatchedBets[order.id];
                    } else if (order.sr == 0) {
                        newMatchedBets[order.id] = newUnmatchedBets[order.id];
                        delete newUnmatchedBets[order.id];
                    }

                    checkForMatchInStopLoss = checkStopLossForMatch(stopLossList, runner.id, order, checkForMatchInStopLoss);
                    
                    // Checks tick offset and then adds to tickOffsetOrdersToRemove if it passes the test, Gets new tickOffsetList without the Order
                    const tickOffsetCheck = checkTickOffsetForMatch(tickOffsetList, order, () => {}, tickOffsetOrdersToRemove, checkForMatchInTickOffset, unmatchedBets, matchedBets)
                    checkForMatchInTickOffset = tickOffsetCheck.checkForMatchInTickOffset;
                    tickOffsetOrdersToRemove = tickOffsetCheck.tickOffsetOrdersToRemove
                })
            }
        })
    })

    expect(checkForMatchInStopLoss).toStrictEqual({
        '237470': {
            strategy: "Stop Loss",
            trailing: true,
            hedged: false,
            assignedIsOrderMatched: true,
            units: "Ticks",
            _id: "5d96d43809bd2142c4321f37",
            marketId: "1.159700186",
            selectionId: 237470,
            side: "LAY",
            size: 5,
            price: "38",
            rfs: "1e4786863a6577c",
            betId: "4235115",
            tickOffset: 5
        },
    })
    expect(Object.keys(tickOffsetOrdersToRemove).length).toEqual(1)
    expect(Object.keys(checkForMatchInTickOffset)).toEqual([])
})

test('tickoffset makes a bet in the right place', () => {

    const ocmData = {
        "op": "ocm",
        "id": 6,
        "initialClk": "GpOH0JwBH762w50BHKKomJ0BGpzR5ZoBH5mWsJwB",
        "clk": "AAAAAAAAAAAAAA==",
        "conflateMs": 0,
        "heartbeatMs": 5000,
        "pt": 1468943673782,
        "ct": "SUB_IMAGE",
        "oc": [{
            "id": "1.125657760",
            "orc": [{
                "fullImage": true,
                "id": "60424",
                "uo": [{
                    "id": "71352090695",
                    "p": 12,
                    "s": 5,
                    "side": "B",
                    "status": "E",
                    "pt": "L",
                    "ot": "L",
                    "pd": 1468919099000,
                    "md": 1468933833000,
                    "avp": 12,
                    "sm": 4.75,
                    "sr": 0.1,
                    "sl": 0,
                    "sc": 0,
                    "sv": 0,
                    "rfs": "ff737fe8398735b"
                }],
                "mb": [
                    [12, 4.75]
                ]
            }]
        }, {
            "id": "1.125657760",
            "orc": [{
                "fullImage": true,
                "id": "237470",
                "uo": [{
                    "id": "71352090695",
                    "p": 12,
                    "s": 5,
                    "side": "B",
                    "status": "E",
                    "pt": "L",
                    "ot": "L",
                    "pd": 1468919099000,
                    "md": 1468933833000,
                    "avp": 12,
                    "sm": 4.75,
                    "sr": 0,
                    "sl": 0,
                    "sc": 0,
                    "sv": 0,
                    "rfs": "1e4786863a6577c"
                }],
                "mb": [
                    [12, 4.75]
                ]
            }]
        }]
    };

    const tickOffsetList = {
        "ff737fe8398735b": {
            "strategy": "Tick Offset",
            "trailing": false,
            "hedged": false,
            "assignedIsOrderMatched": false,
            "units": "Ticks",
            "_id": "5d96cd2fb1d4f6b0a01f1c55",
            "marketId": "1.159700186",
            "selectionId": 60424,
            "price": 3.15,
            "size": 25,
            "side": "LAY",
            "percentageTrigger": 2,
            "rfs": "ff737fe8398735b",
            "betId": "4235115"
        },
    }

    let checkForMatchInTickOffset = Object.assign({}, tickOffsetList)
    let tickOffsetOrdersToRemove = [];
    const ordersPlaced = [];
    const unmatchedBets = {};
    const matchedBets = {};
    
    const placeOrder = (order) => {
        ordersPlaced.push(order)
    }

    
    const tickOffsetCheck = checkTickOffsetForMatch(tickOffsetList, ocmData.oc[0].orc[0].uo[0], placeOrder, tickOffsetOrdersToRemove, checkForMatchInTickOffset, unmatchedBets, matchedBets)
    checkForMatchInTickOffset = tickOffsetCheck.checkForMatchInTickOffset;
    tickOffsetOrdersToRemove = tickOffsetCheck.tickOffsetOrdersToRemove

    expect(ordersPlaced.length).toBe(1); 
})

test('stopLossList should match when sr == 0', () => {
    const stopLossList = {
        237470: {
            strategy: "Stop Loss",
            trailing: true,
            hedged: false,
            assignedIsOrderMatched: false,
            units: "Ticks",
            _id: "5d96d43809bd2142c4321f37",
            marketId: "1.159700186",
            selectionId: 237470,
            side: "LAY",
            size: 5,
            price: "38",
            rfs: "1e4786863a6577c",
            betId: "4235115",
            tickOffset: 5
        },
    }
    const order = {
        rfs: "1e4786863a6577c",
        sr: 0
    }
    const checkForMatchInStopLoss = Object.assign({}, stopLossList)
    const checkMatch = checkStopLossForMatch(stopLossList, 237470, order, checkForMatchInStopLoss);

    expect(checkMatch).toStrictEqual({
        '237470': {
            strategy: "Stop Loss",
            trailing: true,
            hedged: false,
            assignedIsOrderMatched: true,
            units: "Ticks",
            _id: "5d96d43809bd2142c4321f37",
            marketId: "1.159700186",
            selectionId: 237470,
            side: "LAY",
            size: 5,
            price: "38",
            rfs: "1e4786863a6577c",
            betId: "4235115",
            tickOffset: 5
        },
    })
})

describe('tickOffset should return a new tickOffsetObject depending on percentage of the order filled', () => {
    const tickOffsetList = {
        "ff737fe8398735b": {
        "strategy": "Tick Offset",
        "trailing": false,
        "hedged": false,
        "assignedIsOrderMatched": false,
        "units": "Ticks",
        "_id": "5d96cd2fb1d4f6b0a01f1c55",
        "marketId": "1.159700186",
        "selectionId": 60424,
        "price": "810",
        "size": 5,
        "side": "BACK",
        "percentageTrigger": 2,
        "rfs": "ff737fe8398735b",
        "betId": "4235115"
        },
        "aad26b2cb10b4fa": {
        "strategy": "Tick Offset",
        "trailing": false,
        "hedged": false,
        "assignedIsOrderMatched": false,
        "units": "Ticks",
        "_id": "5d96cd2fb1d4f6b0a01f1c56",
        "marketId": "1.159700186",
        "selectionId": 60427,
        "price": "26",
        "size": 5,
        "side": "BACK",
        "percentageTrigger": 2,
        "rfs": "aad26b2cb10b4fa",
        "betId": "4235115"
        },
    }

    const onPlaceOrder = () => {}
    const previousTickOffsetOrdersToRemove = []
    const previousCheckForMatchInTickOffset = Object.assign({}, tickOffsetList)

    test('tickOffset should return a new tickOffsetObject without the object when the sizeMatched passes the threshold', () => {
        const passingOrder = {
            rfs: "ff737fe8398735b",
            sm: 0.1,
        }
        const onPlaceOrder = () => {}
        const previousTickOffsetOrdersToRemove = []
        const previousCheckForMatchInTickOffset = Object.assign({}, tickOffsetList)

        // we use the passing order
        expect(checkTickOffsetForMatch(tickOffsetList, passingOrder, onPlaceOrder, previousTickOffsetOrdersToRemove, previousCheckForMatchInTickOffset)).toEqual(
            expect.objectContaining({
                tickOffsetOrdersToRemove: expect.arrayContaining([tickOffsetList['ff737fe8398735b']]),
                checkForMatchInTickOffset: expect.not.objectContaining(tickOffsetList['ff737fe8398735b'])
            })
        )

        
    })
    test('tickOffset should return the same tickOffsetObject when the sizeMatched doesn\'t pass the threshold', () => {
        const failingOrder = {
            rfs: "ff737fe8398735b",
            sm: 0.01,
        }
        
        // we use the failing order
        expect(checkTickOffsetForMatch(tickOffsetList, failingOrder, onPlaceOrder, previousTickOffsetOrdersToRemove, previousCheckForMatchInTickOffset)).toStrictEqual({
            tickOffsetOrdersToRemove: [],
            checkForMatchInTickOffset: tickOffsetList
        })
    })
})