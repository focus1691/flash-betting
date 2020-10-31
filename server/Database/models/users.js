const mongoose = require('mongoose');
const Settings = require('./settings');
const Orders = require('./orders');
const Markets = require('./markets');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  sessionKey: {
    type: String,
    default: null,
  },
  accessToken: {
    type: String,
    default: null,
  },
  expiresIn: {
    type: Date,
    default: new Date(),
  },
  refreshToken: String,
  markets: [{ type: Markets.schema }],
  premiumSubscription: {
    type: Date,
    default: new Date(),
  },
  settings: Settings.schema,
  orders: [{ type: Orders.schema }],
});

module.exports = mongoose.model('User', userSchema);
