const mongoose = require('mongoose');
const validator = require('validator');

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
    accessToken: String,
    refreshToken: String,
    markets: Array,
    premiumMember: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);