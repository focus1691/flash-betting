const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    trainingBalance: {
        type: Number,
        default: false
    },
    sounds: {
        type: Boolean,
        default: false
    },
    tools: {
        visible: {
            type: Boolean,
            default: false
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    unmatchedBets: {
        visible: {
            type: Boolean,
            default: false
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    matchedBets: {
        visible: {
            type: Boolean,
            default: false
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    graphs: {
        visible: {
            type: Boolean,
            default: false
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    marketInfo: {
        visible: {
            type: Boolean,
            default: false
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    winMarketsOnly: {
        type: Boolean,
        default: true
    },
    rules: {
        visible: {
            type: Boolean,
            default: false
        },
        open: {
            type: Boolean,
            default: false
        }
    },
    trainingLadderAutoCenter: false,
    ladderUnmatched: {
        type: String,
        default: "hedged"
    },
    stakeBtns: {
        type: Array,
        default: [2, 4, 6, 8, 10, 12, 14]
    },
    layBtns: {
        type: Array,
        default: [2.5, 5, 7.5, 10, 12.5, 15, 17.5]
    }
});

module.exports = mongoose.model('Settings', settingsSchema);