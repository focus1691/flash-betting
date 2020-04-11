import { checkStopLossForMatch } from '../utils/ExchangeStreaming/OCMHelper';

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

    expect(checkMatch).toBeTruthy();
})