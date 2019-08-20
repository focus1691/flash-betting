const initialState = {
    name: '',
    balance: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "NAME":
            return {...state, name: action.name };
        case "LAST_NAME":
            return action.payload;
        case "ACCOUNT_BALANCE":
            return {...state, balance: action.balance };
        default:
            return state;
    }
};

export default reducer;