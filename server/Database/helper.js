const Database = require('./database');
const User = require('./models/users');
const Settings = require('./models/settings');
const Order = require('./models/orders');
const Market = require('./models/markets');
const Transaction = require('./models/transaction');

class DatabaseHelper extends Database {
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
                user.save();
            }
        })
    }
    // Save a PayPal payment
    saveTransaction(user, json) {
        return new Promise((res, rej) => {
            const transaction = new Transaction(json);
            if (transaction.status) {
                transaction.save().then(result => {
                    return this.setPremium(user, json.expiresIn);
                });
            }
        });
    }
    getPremiumStatus(user) {
        return new Promise((res, rej) => {
            User.findOne({
                email: user
            }).then(doc => {
                res(doc.premiumSubscription);
            }).catch(err => rej(err));
        });
    }
    getSettings(user) {
        return new Promise((res, rej) => {
            User.findOne({email: user}).then(doc => res(doc.settings))
            .catch(err => rej(err));
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
    setPremium(user, expiresIn) {
        
        return new Promise((res, rej) => {
            User.findOneAndUpdate(
                { email: user },
                { premiumSubscription: expiresIn },
                { new: true, useFindAndModify: false },
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
            User.findOneAndUpdate({email: user},
                tokenInfo, {
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
    async getToken(user) {
        return User.findOne({email: user})
        .then(doc => {
            return doc.accessToken;
        }).catch(err => {
            return err;
        });
    }
    async getTokenData(user) {
        return User.findOne({email: user})
        .then(doc => {
            return {
                accessToken: doc.accessToken,
                refreshToken: doc.refreshToken,
                expiresIn: doc.expiresIn
            }
        })
        .catch(err => {return err});
    }

    saveMarket(user, newMarket) {
        // Create the object with our Order Schema
        newMarket = new Market(newMarket);
        return new Promise((res, rej) => {
            User.findOne({email: user},)
            .then(user => {
                user.markets.push(newMarket)
                user.save();
                res(user.markets)
            }).catch(err => {
                rej(400);
            });
        });
    }

    removeMarket(user, marketToRemove) {
        return new Promise((res, rej) => {
            User.findOne({email: user},)
            .then(user => {
                const index = user.markets.findIndex(item => item.id === marketToRemove.id && item.sportId === marketToRemove.sportId && item.type === marketToRemove.type && item.name === marketToRemove.name);
                user.markets = user.markets.filter((item, itemIndex) => itemIndex !== index);
                user.save();
                res(user.markets)
            }).catch(err => {
                rej(400);
            });
        });
    }

    getAllOrders(user) {
        return new Promise((res, rej) => {
            User.findOne({email: user},)
            .then(user => {
                res(user.orders)
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
                res(200)
            }).catch(err => {
                rej(400);
            });
        });
    }

    updateOrder(user, newOrder) {
        // Create the object with our Order Schema
        newOrder = new Order(newOrder);
        return new Promise((res, rej) => {
            User.findOne({email: user},)
            .then(user => {
                const index = user.orders.findIndex(item => {
                    return newOrder.strategy === "Stop Loss" ? item.selectionId === newOrder.selectionId : item.rfs === newOrder.rfs
                });
                user.orders[index] = newOrder;
                user.save();
                res(200)
            }).catch(err => {
                rej(400);
            });
        });
    }

    removeOrders(user, orders) {
        // Create the object with our Order Schema
        const formattedOrders = orders.map(order => new Order(order))
 
        return new Promise((res, rej) => {
            User.findOne({email: user},)
            .then(user => {
                formattedOrders.find(order => {
                    const index = user.orders.findIndex(item => item.rfs === order.rfs);
                    user.orders.splice(index, 1);
                })
                
                user.save();
                res(200)
            }).catch(err => {
                rej(400);
            });
        });
    }
}

module.exports = new DatabaseHelper();
