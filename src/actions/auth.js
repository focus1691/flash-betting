
export const setName = name => {
    return {
        type: "NAME",
        payload: name
    }
};

export const setBalance = balance => {
    return {
        type: "ACCOUNT_BALANCE",
        payload: balance
    }
};