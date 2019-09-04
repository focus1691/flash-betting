export const setStake = stake => {
    return {
        type: "SET_LAY_STAKE",
        payload: stake
    }
};

export const setPrice = price => {
    return {
        type: "SET_LAY_PRICE",
        payload: price
    }
};

export const setHours = hours => {
    return {
        type: "SET_LAY_HOURS",
        payload: hours
    }
};

export const setMinutes = minutes => {
    return {
        type: "SET_LAY_MINUTES",
        payload: minutes
    }
};

export const setSeconds = seconds => {
    return {
        type: "SET_LAY_SECONDS",
        payload: seconds
    }
};

export const toggleExecutionTime = executionTime => {
    return {
        type: "TOGGLE_LAY_EXECUTION_BEFORE_OR_AFTER",
        payload: executionTime
    }
};