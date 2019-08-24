const initialState = {
    view: '<HomeView/>'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "ACTIVE_VIEW":
            return {...state, view: action.payload };
        default:
            return state;
    }
};

export default reducer;