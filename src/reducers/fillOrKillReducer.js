const initialState = {
    seconds: 10
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_FILL_OR_KILL_TIME":
            return { ...state, view: action.payload };
        default:
            return state;
    }
};

export default reducer;