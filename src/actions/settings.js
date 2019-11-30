export const setDefaultView = view => {
    return {
        type: "SET_DEFAULT_VIEW",
        payload: view
    }
};

export const setActiveView = view => {
    return {
        type: "ACTIVE_VIEW",
        payload: view
    }
};

export const setIsLoading = isLoading => {
    return {
        type: "SET_LOADING",
        payload: isLoading
    }
};

export const openPremiumDialog = open => {
    return {
        type: "TOGGLE_POPUP",
        payload: open
    }
};

export const setSelectedPremium = premium => {
    return {
        type: "SET_SELECTED_PREMIUM",
        payload: premium
    }
};

export const setPremiumStatus = isPremium => {
    return {
        type: "SET_PREMIUM_STATUS",
        payload: isPremium
    }
};

export const setFullscreen = fullscreenSelected => {
    return {
        type: "FULL_SCREEN",
        payload: fullscreenSelected
    }
};

export const setTrainingBalance = balance => {
    return {
        type: "SET_TRAINING_BALANCE",
        payload: balance
    }
};

export const toggleLadderColourContrast = isSelected => {
    return {
        type: "TOGGLE_LADDER_COLOUR_CONTRAST",
        payload: isSelected
    }
};

export const toggleSound = isSelected => {
    return {
        type: "TOGGLE_SOUNDS",
        payload: isSelected
    }
};

export const toggleTools = settings => {
    return {
        type: "TOGGLE_TOOLS",
        payload: settings
    }
};

export const toggleUnmatchedBets = settings => {
    return {
        type: "TOGGLE_UNMATCHED_BETS",
        payload: settings
    }
};

export const toggleMatchedBets = settings => {
    return {
        type: "TOGGLE_MATCHED_BETS",
        payload: settings
    }
};

export const toggleProfitAndLoss = settings => {
    return {
        type: "TOGGLE_PROFIT_AND_LOSS",
        payload: settings
    }
};

export const toggleProjectedSP = settings => {
    return {
        type: "TOGGLE_PROJECTED_SP",
        payload: settings
    }
};

export const toggleGraph = settings => {
    return {
        type: "TOGGLE_GRAPH",
        payload: settings
    }
};

export const toggleMarketInformation = settings => {
    return {
        type: "TOGGLE_MARKET_INFORMATION",
        payload: settings
    }
};

export const setWinMarketsOnly = isChecked => {
    return {
        type: "SET_WIN_MARKETS",
        payload: isChecked
    }
};

export const toggleRules = settings => {
    return {
        type: "TOGGLE_RULES",
        payload: settings
    }
};

export const toggleTrainingLadderAutoCenter = isSelected => {
    return {
        type: "TOGGLE_TRAINING_LADDER_AUTO_CENTER",
        payload: isSelected
    }
};

export const toggleLadderUnmatched = unmatchedColumn => {
    return {
        type: "TOGGLE_LADDER_UNMATCHED_COLUMN",
        payload: unmatchedColumn
    }
};

export const setStakeBtns = buttons => {
    return {
        type: "SET_STAKE_BUTTONS",
        payload: buttons
    }
};

export const setLayBtns = buttons => {
    return {
        type: "SET_LAY_BUTTONS",
        payload: buttons
    }
};

export const updateStakeBtn = data => {
    return {
        type: "UPDATE_STAKE_BUTTON",
        payload: data
    }
};

export const updateLayBtn = data => {
    return {
        type: "UPDATE_LAY_BUTTON",
        payload: data
    }
};

export const setStakeInOneClick = stake => {
    return {
        type: "SET_STAKE_IN_ONE_CLICK_MODE",
        payload: stake
    }
};

export const updateRightClickTicks = ticks => {
    return {
        type: "SET_RIGHT_CLICK_TICKS",
        payload: ticks
    }
};

export const setHorseRacingCountries = horseRaces => {
    return {
        type: "SET_HORSE_RACE_COUNTRIES",
        payload: horseRaces
    }
};


/******** Market panels in sidebar ********/

export const setLaddersExpanded = expanded => {
    return {
        type: "SET_LADDERS_EXPANDED",
        payload: expanded
    }
};

export const setToolsExpanded = expanded => {
    return {
        type: "SET_TOOLS_EXPANDED",
        payload: expanded
    }
};

export const setUnmatchedBetsExpanded = expanded => {
    return {
        type: "SET_UNMATCHED_BETS_EXPANDED",
        payload: expanded
    }
};

export const setMatchedBetsExpanded = expanded => {
    return {
        type: "SET_MATCHED_BETS_EXPANDED",
        payload: expanded
    }
};

export const setGraphExpanded = expanded => {
    return {
        type: "SET_GRAPHS_EXPANDED",
        payload: expanded
    }
};

export const setMarketInfoExpanded = expanded => {
    return {
        type: "SET_MARKET_INFO_EXPANDED",
        payload: expanded
    }
};

export const setRulesExpanded = expanded => {
    return {
        type: "SET_RULES_EXPANDED",
        payload: expanded
    }
};