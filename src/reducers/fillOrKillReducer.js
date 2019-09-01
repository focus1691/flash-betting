const initialState = {
    fillOrKill: 10
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_FILL_OR_KILL":
            return { ...state, view: action.payload };
    }
};

export default reducer;