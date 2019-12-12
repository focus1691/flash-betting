const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    defaultView: {
        type: String,
        default: "HomeView"
    },
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
    },
    rightClickTicks: {
        type: Number,
        default: 1
    },
    horseRaces: {
        GB: {
            type: Boolean,
            default: true
        },
        IE: {
            type: Boolean,
            default: false
        },
        FR: {
            type: Boolean,
            default: false
        },
        DE: {
            type: Boolean,
            default: false
        },
        IT: {
            type: Boolean,
            default: false
        },
        AE: {
            type: Boolean,
            default: false
        },
        TR: {
            type: Boolean,
            default: false
        },
        SG: {
            type: Boolean,
            default: false
        },
        SE: {
            type: Boolean,
            default: false
        },
        US: {
            type: Boolean,
            default: false
        },
        AU: {
            type: Boolean,
            default: false
        },
        NZ: {
            type: Boolean,
            default: false
        },
        ZA: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('Settings', settingsSchema);