const mongoose = require('mongoose'), Schema = mongoose.Schema;
const validator = require('validator');
const Settings = require('./settings');
const Strategies = require('./trading');
const Orders = require('./orders');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            return validator.isEmail(value)
        },
    },
    sessionKey: String,
    accessToken: String,
    expiresIn: Number,
    refreshToken: String,
    markets: Array,
    premiumMember: {
        type: Boolean,
        default: false
    },
    settings: Settings.schema,
    strategies: Strategies.schema,
    orders: [{ type: Schema.Types.ObjectId, ref: 'Orders' }]
});

module.exports = mongoose.model('User', userSchema);