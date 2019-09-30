export const setTickOffsetSelected = isSelected => {
    return {
        type: "SET_TICK_OFFSET_SELECTED",
        payload: isSelected
    }
};

export const setTicks = ticks => {
    return {
        type: "SET_TICK_OFFSET_TICKS",
        payload: ticks
    }
};

export const setUnit = unit => {
    return {
        type: "SET_TICK_OFFSET_UNIT",
        payload: unit
    }
};

export const setPercentTrigger = percent => {
    return {
        type: "SET_TICK_OFFSET_PERCENT_TRIGGER",
        payload: percent
    }
};

export const setHedged = selected => {
    return {
        type: "TOGGLE_TICK_OFFSET_HEDGED",
        payload: selected
    }
};

export const setDisplayText = text => {
    return {
        type: "SET_TICK_OFFSET_TEXT",
        payload: text
    }
};

export const updateTickOffsetList = list => {
    return {
        type: "UPDATE_TICK_OFFSET_LIST",
        payload: list
    }
};