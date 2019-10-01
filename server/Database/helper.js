const mongoose = require('mongoose'), Schema = mongoose.Schema;
const Database = require('./database');
const User = require('./models/users');
const Settings = require('./models/settings');
const Order = require('./models/orders');

class DatabaseHelper extends Database {
    constructor() {
        super();
    }
    setUser(username, sessionKey) {
        User.findOne({
            email: username
        })
        .then(doc => {
            if (!doc || doc.length === 0) {
                // Create a new user
                const user = new User({
                    email: username
                });
                const settings = new Settings();
                user.settings = settings;
                user.save()
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => console.log(err));
            }
        })
    }
    getPremiumStatus(user) {
        return new Promise((res, rej) => {
            User.findOne({
                email: user
            }).then(doc => {
                res(doc.premiumMember);
            }).catch(err => {
                rej(err);
            });
        });
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
            User.findOneAndUpdate(
                { email: user },
                settings, {
                    new: true,
                    useFindAndModify: false
                },
                (err, doc) => {
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
    saveOrder(user, order) {
        // Create the object with our Order Schema
        order = new Order(order);
        return new Promise((res, rej) => {
            User.findOne({email: user},)
            .then(user => {
                user.orders.push(order);
                user.save();
                res(true)
            }).catch(err => {
                rej(false);
            });
        });
    }
}

module.exports = new DatabaseHelper();
