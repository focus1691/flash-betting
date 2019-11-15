const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`mongodb+srv://${"admin"}:${"Cy9dwtcgVi7EGuuV"}@cluster0-gg0gq.mongodb.net/test?retryWrites=true&w=majority`, {
                useCreateIndex: true,
                useNewUrlParser: true
            })
            .then(() => {
                console.log('Database connection successful');
            })
            .catch(err => {
                console.error('Database connection error: ', err);
            })
    }
}

module.exports = Database;