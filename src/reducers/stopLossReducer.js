const initialState = {
    offset: 5,
    units: {
        ticks: true,
        percent: false,
    },
    trailing: true,
    hedged: true,
    chaser: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_STOP_LOSS_OFFSET":
            return { ...state, view: action.payload };
        case "SET_STOP_LOSS_UNIT":
            return { ...state, view: action.payload };
        case "TOGGLE_STOP_LOSS_TRAILING":
            return { ...state, view: action.payload };
        case "TOGGLE_STOP_LOSS_HEDGED":
            return { ...state, view: action.payload };
        case "TOGGLE_STOP_LOSS_CHASER":
            return { ...state, view: action.payload };
        default:
            return state;
    }
};

export default reducer;