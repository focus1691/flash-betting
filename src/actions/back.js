export const setStake = stake => {
    return {
        type: "SET_BACK_STAKE",
        payload: stake
    }
};

export const setPrice = price => {
    return {
        type: "SET_BACK_PRICE",
        payload: price
    }
};

export const toggleFillOrKill = selected => {
    return {
        type: "TOGGLE_BACK_FILL_OR_KILL",
        payload: selected
    }
};

export const toggleStopLoss = selected => {
    return {
        type: "TOGGLE_BACK_STOP_LOSS",
        payload: selected
    }
};

export const toggleTickOffset = selected => {
    return {
        type: "TOGGLE_BACK_TICK_OFFSET",
        payload: selected
    }
};

export const setHours = hours => {
    return {
        type: "SET_BACK_HOURS",
        payload: hours
    }
};

export const setMinutes = minutes => {
    return {
        type: "SET_BACK_MINUTES",
        payload: minutes
    }
};

export const setSeconds = seconds => {
    return {
        type: "SET_BACK_SECONDS",
        payload: seconds
    }
};

export const toggleExecutionTime = executionTime => {
    return {
        type: "TOGGLE_BACK_EXECUTION_BEFORE_OR_AFTER",
        payload: executionTime
    }
};