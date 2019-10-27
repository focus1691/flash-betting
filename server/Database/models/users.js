const mongoose = require('mongoose'), Schema = mongoose.Schema;
const Settings = require('./settings');
const Strategies = require('./trading');
const Orders = require('./orders');
const Markets = require('./markets');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    sessionKey: String,
    accessToken: String,
    expiresIn: {
        type: Date,
        default: new Date()
    },
    refreshToken: String,
    markets: [{ type: Markets.schema }],
    premiumSubscription: {
        type: Date,
        default: new Date()
    },
    settings: Settings.schema,
    strategies: Strategies.schema,
    orders: [{ type: Orders.schema }]
});

module.exports = mongoose.model('User', userSchema);