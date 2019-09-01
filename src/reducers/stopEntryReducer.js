const initialState = {
    ltp: {
        lessThan: true,
        equal: false,
        greaterThan: false
    },
    stake: 2,
    price: 750,
    ticks: 3
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LAST_TRADED_PRICE":
            return { ...state, view: action.payload };
        case "SET_STAKE":
            return { ...state, view: action.payload };
        case "SET_PRICE":
            return { ...state, view: action.payload };
        case "SET_TICKS":
            return { ...state, view: action.payload };
    }
};

export default reducer;