const mongoose = require('mongoose');
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
});

module.exports = mongoose.model('User', userSchema);
