const initialState = {
    view: 'HomeView',
    trainingBalance: 1000,
    ladderColourContrast: false,
    sounds: false,
    tools: {
        visible: true,
        open: false
    },
    unmatchedBets: {
        visible: false,
        open: false
    },
    matchedBets: {
        visible: false,
        open: false
    },
    profitAndLoss: {
        visible: false,
        open: false
    },
    projectedSP: {
        visible: false,
        open: false
    },
    graphs: {
        visible: false,
        open: false 
    },
    marketInfo: {
        visible: false,
        open: false
    },
    rules: {
        visible: false,
        open: false
    },
    trainingLadderAutoCenter: false,
    ladderUnmatched: {
        unmatchedBets: false,
        unmatchedBetsPL: false,
        unmatchedBetsHedge: false
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "ACTIVE_VIEW":
            return { ...state, view: action.payload };
        case "SET_TRAINING_BALANCE":
            return { ...state, trainingBalance: action.payload };
        case "TOGGLE_LADDER_COLOUR_CONTRAST":
            return { ...state, ladderColourContrast: action.payload };
        case "TOGGLE_SOUNDS":
            return { ...state, sounds: action.payload };
        case "TOGGLE_TOOLS":
            return { ...state, tools: action.payload };
        case "TOGGLE_UNMATCHED_BETS":
            return { ...state, unmatchedBets: action.payload };
        case "TOGGLE_MATCHED_BETS":
            return { ...state, matchedBets: action.payload };
        case "TOGGLE_PROFIT_AND_LOSS":
            return { ...state, profitAndLoss: action.payload };
        case "TOGGLE_PROJECTED_SP":
            return { ...state, projectedSP: action.payload };
        case "TOGGLE_GRAPH":
            return { ...state, graphs: action.payload }; 
        case "TOGGLE_MARKET_INFORMATION":
            return { ...state, marketInfo: action.payload };
        case "TOGGLE_RULES":
            return { ...state, rules: action.payload };
        case "TOGGLE_TRAINING_LADDER_AUTO_CENTER":
            return { ...state, trainingLadderAutoCenter: action.payload };
        case "TOGGLE_LADDER_UNMATCHED_COLUMN":
            return { ...state, ladderUnmatched: action.payload };
        default:
            return state;
    }
};

export default reducer;