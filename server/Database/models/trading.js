const mongoose = require('mongoose');

const tradingSchema = mongoose.Schema({
    stopLoss: {
        selected: {
            type: Boolean,
            default: false
        },
        ticks: {
            type: Number,
            default: 5
        },
        ticksSelected: {
            type: Boolean,
            default: true
        },
        percentageSelected: {
            type: Boolean,
            default: false
        },
        trailing: {
            type: Boolean,
            default: false
        },
        hedged: {
            type: Boolean,
            default: false
        }
    },
    tickOffset: {
        selected: {
            type: Boolean,
            default: false
        },
        ticks: {
            type: Number,
            default: 5
        },
        ticksSelected: {
            type: Boolean,
            default: true
        },
        percentageSelected: {
            type: Boolean,
            default: false
        },
        percentTrigger: {
            type: Number,
            default: 1
        },
        hedged: {
            type: Boolean,
            default: false
        }
    },

    back: {
        selected: {
            type: Boolean,
            default: false
        },
        stake: {
            type: Number,
            default: 10
        },
        price: {
            type: Number,
            default: 1.50
        },
        hh: {
            type: Number,
            default: 0
        },
        mm: {
            type: Number,
            default: 0
        },
        ss: {
            type: Number,
            default: 0
        },
        beforeMarket: {
            type: Boolean,
            default: false
        },
        afterMarket: {
            type: Boolean,
            default: true
        }
    },
    lay: {
        selected: {
            type: Boolean,
            default: false
        },
        stake: {
            type: Number,
            default: 10
        },
        price: {
            type: Number,
            default: 1.50
        },
        hh: {
            type: Number,
            default: 0
        },
        mm: {
            type: Number,
            default: 0
        },
        ss: {
            type: Number,
            default: 0
        },
        beforeMarket: {
            type: Boolean,
            default: false
        },
        afterMarket: {
            type: Boolean,
            default: true
        }
    },
    fillOrKill: {
        selected: {
            type: Boolean,
            default: false
        },
        seconds: {
            type: Number,
            default: 1
        }
    },
    stopEntry: {
        selected: {
            type: Boolean,
            default: false
        },
        LTPExecution: {
            type: String,
            default: "<"
        },
        stake: {
            type: Number,
            default: 10
        },
        price: {
            type: Number,
            default: 1.50
        }
    }
});

module.exports = mongoose.model('Trading', tradingSchema);