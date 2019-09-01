const initialState = {
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
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_STAKE":
            return { ...state, view: action.payload };
        case "SET_PRICE":
            return { ...state, view: action.payload };
        case "TOGGLE_FILL_OR_KILL":
            return { ...state, view: action.payload };
        case "TOGGLE_STOP_LOSS":
            return { ...state, view: action.payload };
        case "TOGGLE_TICK_OFFSET":
            return { ...state, view: action.payload };
        case "SET_HOURS":
            return { ...state, view: action.payload };
        case "SET_MINUTES":
            return { ...sstate, view: action.payload };
        case "SET_SECONDS":
            return { ...state, view: action.payload };
        case "TOGGLE_EXECUTION_BEFORE_OR_AFTER":
            return { ...state, view: action.payload };
    }
};

export default reducer;