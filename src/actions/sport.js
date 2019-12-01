export const setAllSports = sports => {
    return {
        type: "SPORTS_LIST",
        payload: sports
    }
};

export const updateSubmenuList = submenu => {
    return {
        type: "UPDATE_SUBMENU_LIST",
        payload: submenu
    }
}

export const updateSubmenuListMyMarkets = submenu => {
    return {
        type: "UPDATE_SUBMENU_LIST_MYMARKETS",
        payload: submenu
    }
}

export const updateCurrentSubmenu = submenu => {
    return {
        type: "UPDATE_SUBMENU_CURRENT",
        payload: submenu
    }
}

export const updateSubmenuMyMarkets = submenu => {
    return {
        type: "UPDATE_SUBMENU_CURRENT_MYMARKETS",
        payload: submenu
    }
}

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