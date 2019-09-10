const initialState = {
    seconds: 10
}
initialState.text = `${initialState.seconds} seconds`;

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_FILL_OR_KILL_TEXT":
            return { ...state, text: action.payload };
        case "SET_FILL_OR_KILL_TIME":
            return { ...state, seconds: action.payload };
        default:
            return state;
    }
};

export default reducer;