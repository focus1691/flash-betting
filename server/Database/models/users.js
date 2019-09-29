const mongoose = require('mongoose');
const Settings = require('./settings');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
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
    settings: Settings.schema
});

module.exports = mongoose.model('User', userSchema);