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
                    rej(404);
                }
                res(200);
            })
        });
    }
    setToken(user, tokenInfo) {
        return new Promise((res, rej) => {
            User.findOneAndUpdate({
                email: user
            }, tokenInfo, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }).then(user => {
                res(true);
            }).catch(err => {
                rej(false);
            });
        });
    }
    getToken(user) {
        return new Promise((res, rej) => {
            User.findOne({
                email: user
            }).then(doc => {
                res(doc.accessToken)
            }).catch(err => {
                rej(err);
            });
        });
    }
}

module.exports = new DatabaseHelper();
