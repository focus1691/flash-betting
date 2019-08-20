

const initialState = {
    sports: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "SPORTS_LIST":
            return action.payload;
        default:
            return [];
    }
};

export default reducer;