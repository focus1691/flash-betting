const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb+srv://${"admin"}:${"6agNmmoGX4pgB5Ns"}@cluster0-gg0gq.mongodb.net/test?retryWrites=true&w=majority`, {
                useCreateIndex: true,
                useNewUrlParser: true
            })
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error');
            })
    }
}

module.exports = Database;