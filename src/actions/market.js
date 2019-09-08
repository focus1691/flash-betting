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