const initialState = {
    marketOpen: false,
    currentMarket: {},
    runnerSelection: 0,
    runners: {},
    ladder: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_MARKET':
            return { ...state, marketOpen: true, currentMarket: action.payload };
        case 'LOAD_LADDER':
            return { ...state, ladder: action.payload };
        case 'LOAD_RUNNERS':
            return { ...state, runners: action.payload };
        case 'SELECT_RUNNER':
            return { ...state, runnerSelection: action.payload};
        default:
            return state;
    }
}

export default reducer;