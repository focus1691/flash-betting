const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    selectionId: Number,
    strategy: {
        type: String,
        default: "None"
    },
    marketId: String,
    size: Number,
    price: String, // this can be the price before the tickOffset or the price that will be bet
    side: String,
    betId: {
        type: String, 
    },
    rfs: { // rfs used for deletion and referencing
        type: String
    },

    // stopLoss
    trailing: {
        type: Boolean,
        default: false
    },
    hedged: {
        type: Boolean,
        default: false,
    },
    assignedIsOrderMatched: { // this is to check if the stopLoss has an order attached to it
        type: Boolean,
        default: false
    },
    tickOffset: Number,
    units: {
        type: String,
        default: "Ticks"
    },

    // tickOffset (newPrice = price)
    percentageTrigger: Number,

    // back and Lay
    executionTime: String,
    timeOffset: Number,

    // fill or kill
    seconds: Number,
    startTime: Number,
    

    // stop Entry
    targetLTP: Number,
    stopEntryCondition: String, 

    


});

module.exports = mongoose.model('Orders', ordersSchema);