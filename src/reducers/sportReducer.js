

const initialState = {
    sports: [],
    currentSport: {
        currentSportId: undefined,
        marketCountries: [], 
        currentCountry: undefined
    }
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {
        case "SPORTS_LIST":
            return  {...state, sports: action.payload };
        case "SPORTS_CURRENT":
            return  {...state, currentSport: action.payload };
        default:
            return state;
    }
};

export default reducer;