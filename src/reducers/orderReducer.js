const initialState = {
    stopLoss: {
        offset: {
            value: 3,
            ticks: true,
            percent: false,
        },
        trailing: false,
        hedged: false,
        chaser: false
    },
    tickOffset: {
        offset: {
            value: 3,
            ticks: true,
            percent: false,
        },
        triggerPercent: 2,
        hedged: false
    },
    back: {
        stake: 2,
        price: 750,
        fillOrKill: false,
        stopLoss: false,
        tickOffset: false,
        offset: {
            hours: 0,
            minutes: 0,
            seconds: 0,
            beforeMarket: true,
            afterMarket: false
        },
    },
    lay: {
        stake: 2,
        price: 750,
        fillOrKill: false,
        stopLoss: false,
        tickOffset: false,
        offset: {
            hours: 0,
            minutes: 0,
            seconds: 0,
            beforeMarket: true,
            afterMarket: false
        },
    },
    fillOrKill: 10,
    stopEntry: {
        ltp: {
            lessThan: true,
            equal: false,
            greaterThan: false
        },
        stake: 2,
        price: 750,
        ticks: 3
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        
    }
};

export default reducer;