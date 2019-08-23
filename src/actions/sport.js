

export const setAllSports = sports => {
    return {
        type: "SPORTS_LIST",
        payload: sports
    }
};

export const setCurrentSport = sport => {
    return {
        type: "SPORTS_CURRENT",
        payload: sport
    }
};

export const setCurrentMarket = market => {
    return {
        type: "CURRENT_MARKET",
        payload: market
    }
};