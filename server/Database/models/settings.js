const mongoose = require('mongoose');
const validator = require('validator');

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
        unmatchedBets: {
            type: Boolean,
            default: false
        },
        unmatchedBetsPL: {
            type: Boolean,
            default: false
        },
        unmatchedBetsHedge: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('Settings', settingsSchema);