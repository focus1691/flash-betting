const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-gg0gq.mongodb.net/test?retryWrites=true&w=majority`)
       .then(() => {
         console.log('Database connection successful');
       })
       .catch(err => {
         console.error('Database connection error');
       })
  }
}

module.exports = new Database();