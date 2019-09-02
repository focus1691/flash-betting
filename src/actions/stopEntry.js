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