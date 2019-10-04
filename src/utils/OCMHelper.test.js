import { checkStopLossForMatch, checkTickOffsetForMatch } from './OCMHelper'

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
    expect(checkStopLossForMatch(stopLossList, 237470, order, checkForMatchInStopLoss)).toStrictEqual({
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