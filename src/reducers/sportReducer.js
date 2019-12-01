const initialState = {
    sports: [],
    submenuList: {},
    currentSubmenu: "",
    currentSport: {
        currentSportId: undefined,
        sportCountries: [], 
        currentCountry: undefined,
        countryCompetitions: [],
        currentCompetition: undefined,
        competitionEvents: [],
        currentEvent: undefined,
        eventMarkets: [],
    },
    currentMarket: undefined
}

const reducer = (state = initialState, action) => {
    
    switch (action.type) {
        case "SPORTS_LIST":
            return { ...state, sports: action.payload };
        case "UPDATE_SUBMENU_LIST":
            return { ...state, submenuList: action.payload };
        case "UPDATE_SUBMENU_CURRENT":
            return { ...state, currentSubmenu: action.payload };
        case "SPORTS_CURRENT":
            return { ...state, currentSport: action.payload };
        case "CURRENT_MARKET":
            return { ...state, currentMarket: action.payload };
        default:
            return state;
    }
};

export default reducer;