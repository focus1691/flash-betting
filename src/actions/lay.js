export const setLaySelected = isSelected => {
    return {
        type: "SET_LAY_SELECTED",
        payload: isSelected
    }
};

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

export const setDisplayText = text => {
    return {
        type: "SET_LAY_TEXT",
        payload: text
    }
};

export const setSelections = selections => {
    return {
        type: "SET_LAY_SELECTIONS",
        payload: selections
    }
}

export const updateLayList = list => {
    return {
        type: "UPDATE_LAY_LIST",
        payload: list
    }
}