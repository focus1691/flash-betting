/* eslint-disable class-methods-use-this */
const Database = require('.');
const User = require('./models/users');
const Market = require('./models/markets');

class DatabaseHelper extends Database {
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
