const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    trainingBalance: {
        type: Number,
        default: true
    },
    sounds: {
        type: Boolean,
        default: true
    },
    tools: {
        visible: {
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    unmatchedBets: {
        visible: {
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    matchedBets: {
        visible: {
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    graphs: {
        visible: {
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    marketInfo: {
        visible: {
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    winMarketsOnly: {
        type: Boolean,
        default: true
    },
    rules: {
        visible: {
            type: Boolean,
            default: true
        },
        open: {
            type: Boolean,
            default: true
        }
    },
    trainingLadderAutoCenter: true,
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