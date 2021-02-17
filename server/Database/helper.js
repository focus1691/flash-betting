/* eslint-disable class-methods-use-this */
const Database = require('./database');
const User = require('./models/users');
const Market = require('./models/markets');
const Transaction = require('./models/transaction');

class DatabaseHelper extends Database {
  setUser(username) {
    User.findOne({
      email: username,
    }).then((doc) => {
      if (!doc || doc.length === 0) {
        // Create a new user
        const user = new User({
          email: username,
        });
        user.save();
      }
    });
  }

  setToken(user, tokenInfo) {
    return new Promise((res, rej) => {
      User.findOneAndUpdate({ email: user }, tokenInfo, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      })
        .then((user) => {
          res(true);
        })
        .catch((err) => {
          rej(false);
        });
    });
  }

  async getToken(user) {
    return User.findOne({ email: user })
      .then((doc) => doc.accessToken)
      .catch((err) => err);
  }

  async getTokenData(user) {
    return User.findOne({ email: user })
      .then((doc) => ({
        accessToken: doc.accessToken,
        refreshToken: doc.refreshToken,
        expiresIn: doc.expiresIn,
      }))
      .catch((err) => err);
  }

  saveMarket(user, newMarket) {
    return new Promise((res, rej) => {
      // Create the object with our Order Schema
      newMarket = new Market(newMarket);
      User.findOne({ email: user })
        .then((user) => {
          user.markets.push(newMarket);
          user.save();
          res(user.markets);
        })
        .catch((error) => rej(error));
    });
  }

  removeMarket(user, marketToRemove) {
    return new Promise((res, rej) => {
      User.findOne({ email: user })
        .then((user) => {
          const index = user.markets.findIndex(
            (item) => item.id === marketToRemove.id
							&& item.sportId === marketToRemove.sportId
							&& item.type === marketToRemove.type
							&& item.name === marketToRemove.name,
          );
          user.markets = user.markets.filter((item, itemIndex) => itemIndex !== index);
          user.save();
          res(user.markets);
        })
        .catch((error) => rej(error));
    });
  }
}

module.exports = new DatabaseHelper();
