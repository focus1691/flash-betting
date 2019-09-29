const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    type: String,
    marketId: String,
    selectionId: Number,
    matchedPrice: String,
    side: String,
    size: Number,
    trailing: {
        type: String,
        default: false
    },
    rfs: {
        type: String
    },
    assignedIsOrderMatched: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Orders', ordersSchema);