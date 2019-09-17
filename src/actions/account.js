
export const setAccountDetails = details => {
    return {
        type: "ACCOUNT_DETAILS",
        payload: details
    }
};

export const setBalance = balance => {
    return {
        type: "ACCOUNT_BALANCE",
        payload: balance
    }
};

export const setTime = time => {
    return {
        type: "UPDATE_TIME",
        payload: time
    }
};

export const setLoggedIn = loggedIn => {
    return {
        type: "LOG_IN",
        payload: loggedIn
    }
}