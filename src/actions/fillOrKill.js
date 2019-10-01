export const setFillOrKillSelected = isSelected => {
    return {
        type: "SET_FILL_OR_KILL_SELECTED",
        payload: isSelected
    }
};

export const setFillOrKill = seconds => {
    return {
        type: "SET_FILL_OR_KILL_TIME",
        payload: seconds
    }
};

export const setDisplayText = text => {
    return {
        type: "SET_FILL_OR_KILL_TEXT",
        payload: text
    }
};

export const updateFillOrKillList = list => {
    return {
        type: "UPDATE_FILL_OR_KILL_LIST",
        payload: list
    }
};