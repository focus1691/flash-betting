export const setActiveView = view => {
    return {
        type: "ACTIVE_VIEW",
        payload: view
    }
};

export const setTrainingBalance = balance => {
    return {
        type: "SET_TRAINING_BALANCE",
        payload: balance
    }
}

export const toggleLadderColourContrast = isSelected => {
    return {
        type: "TOGGLE_LADDER_COLOUR_CONTRAST",
        payload: isSelected
    }
}

export const toggleSound = isSelected => {
    return {
        type: "TOGGLE_SOUNDS",
        payload: isSelected
    }
}

export const toggleTools = settings => {
    return {
        type: "TOGGLE_TOOLS",
        payload: settings
    }
}

export const toggleUnmatchedBets = settings => {
    return {
        type: "TOGGLE_UNMATCHED_BETS",
        payload: settings
    }
}

export const toggleMatchedBets = settings => {
    return {
        type: "TOGGLE_MATCHED_BETS",
        payload: settings
    }
}

export const toggleProfitAndLoss = settings => {
    return {
        type: "TOGGLE_PROFIT_AND_LOSS",
        payload: settings
    }
}

export const toggleProjectedSP = settings => {
    return {
        type: "TOGGLE_PROJECTED_SP",
        payload: settings
    }
}

export const toggleGraph = settings => {
    return {
        type: "TOGGLE_GRAPH",
        payload: settings
    }
}

export const toggleMarketInformation = settings => {
    return {
        type: "TOGGLE_MARKET_INFORMATION",
        payload: settings
    }
}

export const toggleRules = settings => {
    return {
        type: "TOGGLE_RULES",
        payload: settings
    }
}

export const toggleTrainingLadderAutoCenter = isSelected => {
    return {
        type: "TOGGLE_TRAINING_LADDER_AUTO_CENTER",
        payload: isSelected
    }
}

export const toggleLadderUnmatched = settings => {
    return {
        type: "TOGGLE_LADDER_UNMATCHED_COLUMN",
        payload: settings
    }
}