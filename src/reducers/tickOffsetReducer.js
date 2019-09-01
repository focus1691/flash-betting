const initialState = {
    offset: {
        value: 3,
        ticks: true,
        percent: false,
    },
    triggerPercent: 2,
    hedged: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_VALUE":
            return { ...state, view: action.payload };
        case "SET_UNIT":
            return { ...state, view: action.payload };
        case "SET_TRIGGER":
            return { ...state, view: action.payload };
        case "TOGGLE_HEDGED":
            return { ...state, view: action.payload };
    }
};

export default reducer;