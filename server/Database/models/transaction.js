const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    address: {
        city: String,
        country_code: String,
        line1: String,
        postal_code: String,
        recipient_name: String,
        state: String
    },
    cancelled: Boolean,
    email: String,
    paid: Boolean,
    payerID: String,
    paymentID: String,
    paymentToken: String,
    returnUrl: String
});

module.exports = mongoose.model('Transaction', transactionSchema);