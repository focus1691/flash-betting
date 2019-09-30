export const setStopEntrySelected = isSelected => {
    return {
        type: "SET_STOP_ENTRY_SELECTED",
        payload: isSelected
    }
};

export const setLTPOperator = operator => {
    return {
        type: "SET_STOP_ENTRY_OPERATOR",
        payload: operator
    }
};

export const setTicks = ticks => {
    return {
        type: "SET_STOP_ENTRY_TICKS",
        payload: ticks
    }
};

export const setStake = stake => {
    return {
        type: "SET_STOP_ENTRY_STAKE",
        payload: stake
    }
};

export const setPrice = price => {
    return {
        type: "SET_STOP_ENTRY_PRICE",
        payload: price
    }
};

export const setSide = side => {
    return {
        type: "SET_STOP_ENTRY_SIDE",
        payload: side
    }
};

export const updateStopEntryList = list => {
    return {
        type: "UPDATE_STOP_ENTRY_LIST",
        payload: list
    }
};

export const setSelections = selections => {
    return {
        type: "SET_STOP_ENTRY_SELECTIONS",
        payload: selections
    }
}