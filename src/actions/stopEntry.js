export const setLTPOperator = killTime => {
    return {
        type: "SET_OPERATOR",
        payload: killTime
    }
};

export const setStake = stake => {
    return {
        type: "SET_STAKE",
        payload: stake
    }
};

export const setPrice = price => {
    return {
        type: "SET_PRICE",
        payload: price
    }
};

export const setTicks = ticks => {
    return {
        type: "SET_TICKS",
        payload: ticks
    }
};