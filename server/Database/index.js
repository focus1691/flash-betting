const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    const { DB_USER, DB_PASS } = process.env;
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0-gg0gq.mongodb.net/test?retryWrites=true&w=majority`, {
      useCreateIndex: true,
      useNewUrlParser: true,
    })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error: ', err);
      });
  }
}

module.exports = Database;
