export const setBackSelected = isSelected => {
    return {
        type: "SET_BACK_SELECTED",
        payload: isSelected
    }
};

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

export const setDisplayText = text => {
    return {
        type: "SET_BACK_TEXT",
        payload: text
    }
};

export const setSelections = selections => {
    return {
        type: "SET_BACK_SELECTIONS",
        payload: selections
    }
}

export const updateBackList = list => {
    return {
        type: "UPDATE_BACK_LIST",
        payload: list
    }
};