import { getThemeProps } from "@material-ui/styles";

export const loadMarket = market => {
    return {
        type: "LOAD_MARKET",
        payload: market
    }
}

export const loadLadder = ladder => {
    return {
        type: "LOAD_LADDER",
        payload: ladder
    }
}

export const loadRunners = runners => {
    return {
        type: "LOAD_RUNNERS",
        payload: runners
    }
}

export const setRunner = runner => {
    return {
        type: "SELECT_RUNNER",
        payload: runner
    }
}

export const updateOrder = order => {
    return {
        type: "UPDATE_ORDER",
        payload: order
    }
};

export const toggleVisibility = settings => {
    return {
        type: "TOGGLE_ORDER_VISIBILITY",
        payload: settings
    }
}