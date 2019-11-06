const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({

    id: String,
    status: String,
    type: String,
    currencyIsoCode: String,
    amount: Number,
    merchantAccountId: String,
    subMerchantAccountId: String,
    masterMerchantAccountId: String,
    orderId: String,
    createdAt: String,
    updatedAt: String,
    customer: { 
        id: String,
        firstName: String,
        lastName: String,
        company: String,
        email: String,
        website: String,
        phone: String,
        fax: String
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);