const initialState = {
    offset: 5,
    units: "Ticks",
    trailing: true,
    hedged: true,
    chaser: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_STOP_LOSS_OFFSET":
            return { ...state, offset: action.payload };
        case "SET_STOP_LOSS_UNITS":
            return { ...state, units: action.payload };
        case "TOGGLE_STOP_LOSS_TRAILING":
            return { ...state, trailing: action.payload };
        case "TOGGLE_STOP_LOSS_HEDGED":
            return { ...state, hedged: action.payload };
        case "TOGGLE_STOP_LOSS_CHASER":
            return { ...state, chaser: action.payload };
        default:
            return state;
    }
};

export default reducer;