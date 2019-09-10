export const setStopLossOffset = offset => {
    return {
        type: "SET_STOP_LOSS_OFFSET",
        payload: offset
    }
};

export const setStopLossUnit = unit => {
    return {
        type: "SET_STOP_LOSS_UNITS",
        payload: unit
    }
};

export const toggleStopLossTrailing = selected => {
    return {
        type: "TOGGLE_STOP_LOSS_TRAILING",
        payload: selected
    }
};
export const toggleStopLossHedged = selected => {
    return {
        type: "TOGGLE_STOP_LOSS_HEDGED",
        payload: selected
    }
};

export const setDisplayText = text => {
    return {
        type: "SET_STOP_LOSS_TEXT",
        payload: text
    }
};