const sportReducer = (state = [], action) => {
    switch (action.type) {
        case "SPORTS_LIST":
            return action.payload;
        default:
            return [];
    }
};

export default sportReducer;