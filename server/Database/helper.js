const Database = require('./database');
const User = require('./models/users');

class DatabaseHelper extends Database {
    constructor() {
        super();
    }
    setUser(username, sessionKey) {
        User.findOne({
            email: username
        })
        .then(doc => {
            if (doc.length === 0) {
                // Create a new user
                const user = new User({
                    email: request.query.user
                });
                user.save()
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => console.log(err));
            } else {

            }

        })
    }
    getSettings(user) {
        return new Promise((res, rej) => {
            User.findOne({
                email: user
            })
            .then(doc => {
                res(doc.settings);
            })
            .catch(err => {
                console.log(err);
                rej(err);
            });
        });
    }
    updateSettings(user, settings) {
        return new Promise((res, rej) => {
            User.findOneAndUpdate({
                email: user
            }, settings, {
                new: true,
                useFindAndModify: false
            }, (err, doc) => {
                if (err) {
                    console.log(err);
                    rej(404);
                }
                res(200);
            })
        });
    }
    setToken(user, token) {
        return new Promise((res, rej) => {
            User.findOneAndUpdate({
                email: session.email
            }, tokenInfo, {
                new: true,
                runValidators: true
            }).then(user => {
                return true;
            }).catch(err => {
                return false;
            });
        });
    }
}

module.exports = new DatabaseHelper();
