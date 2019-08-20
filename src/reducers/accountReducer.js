const initialState = {
    name: '',
    balance: '',
    time: new Date().toLocaleString()
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "NAME":
            return {...state, name: action.payload };
        case "LAST_NAME":
            return action.payload;
        case "ACCOUNT_BALANCE":
            return {...state, balance: action.payload };
        case "UPDATE_TIME":
            return {...state, time: action.payload}
        default:
            return state;
    }
};

export default reducer;