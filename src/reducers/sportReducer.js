

const initialState = {
    sports: [],
    currentSport: {
        currentSportId: undefined,
        marketCountries: [], 
        currentCountry: undefined,
        countryEvents: [],
        currentEvent: undefined,
        eventMarkets: [],
    },
    currentMarket: undefined
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {
        case "SPORTS_LIST":
            return { ...state, sports: action.payload };
        case "SPORTS_CURRENT":
            return { ...state, currentSport: action.payload };
        case "CURRENT_MARKET": 
            return { ...state, currentMarket: action.payload };
        default:
            return state;
    }
};

export default reducer;