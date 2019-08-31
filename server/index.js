// This adds environment-specific variables on new lines in the form of NAME=VALUE
// Access with process.env
require('dotenv').config();

// The BetFair session class below contains all the methods
// to call the BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('./BetFair/session.js');
const ExchangeStream = require('./BetFair/stream-api.js');

const session = new BetFairSession(process.env.APP_KEY);

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const mongoose = require('mongoose');
const database = require('./database');
const User = require('./models/users');

app.get('/api/load-session', (request, response) => {
    session.setActiveSession(request.query.sessionKey);
    session.setEmailAddress(request.query.email);

    this.exchangeStream = new ExchangeStream();
    this.exchangeStream.setSessionKey("1azOlKw9NYKlf8EO/yDMxX4ZTtwpsmv9G2nc6tRSyTVhhI3K1m5PiE73YYx5/s/+");
    this.exchangeStream.authenticate(process.env.APP_KEY);

    response.send('sent');
});

app.get('/api/load-application-key', (request, response) => {
    // this.exchangeStream = new ExchangeStream();
    // this.exchangeStream.setSessionKey(accessToken);
    // this.exchangeStream.authenticate(APPKEY);

});

app.get('/api/get-subscription-status', (request, response) => {
    session.isAccountSubscribedToWebApp({
        "vendorId": "74333"
    }, (err, res) => {
        response.json({
            val: res.result
        });
    });
});

app.get('/api/login', (request, response) => {
    session.login(request.query.user, request.query.pass).then((res) => {
        response.json({
            sessionKey: res.sessionKey
        });

        // Check if user exists, if doesn't exist, then create a new user

        User.find({
                email: request.query.user
            })
            .then(doc => {

                if (doc.length === 0) {
                    //****** Creating a user
                    const user = new User({
                        email: request.query.user
                    });
                    user.save()
                        .then(result => {
                            console.log(result);
                        })
                        .catch(err => console.log(err));
                }

            })
            .catch(console.log)


    }).bind(this).catch(err => response.json({
        error: err
    }));
});

app.get('/api/logout', (request, response) => {
    session.logout().then((res) => {
        console.log('logout', res);
        response.json(res.result);
    }).bind(this).catch(err => response.json({
        error: err
    }));
});

app.get('/api/get-account-balance', (request, response) => {
    session.getAccountFunds({
        filter: {}
    }, ((err, res) => {
        response.json({
            balance: res.result.availableToBetBalance
        });
    }));
});

app.get('/api/get-account-details', (request, response) => {
    session.getAccountDetails({
        filter: {}
    }, ((err, res) => {
        response.json({
            name: res.result.firstName,
            countryCode: res.result.countryCode
        });
    }));
});

app.get('/api/get-user-settings', (request, response) => {
    User.findOne({
            email: session.email
        })
        .then(doc => {
            response.json(doc.settings);
        })
        .catch(err => {
            console.log(err);
        })
});

app.post('/api/save-user-settings', (request, response) => {
    User.findOneAndUpdate({
        email: session.email
    }, request.body, {
        new: true,
        useFindAndModify: false
    }, (err, doc) => {
        if (err) {
            console.log(err);
        }
        response.sendStatus(200);
    })
});

app.get('/api/request-access-token', (request, response) => {
    // This call can be used for the refresh token
    // by changing the "grant type" to "REFRESH_TOKEN"
    var filter = {
        "client_id": process.env.APP_ID,
        "grant_type": "AUTHORIZATION_CODE",
        "client_secret": process.env.APP_SECRET,
        "code": request.query.code
    }
    // Accounts API method to exchange the BetFair 'code'
    // with an 'access token', required for the Stream API
    session.token(filter, (err, res) => {
        var tokenInfo = {
            accessToken: res.result.access_token,
            expiresIn: res.result.expires_in,
            refreshToken: res.result.refresh_token
        }

        // Update the user details with the token information
        console.log('token info:', tokenInfo);
        User.findOneAndUpdate({
            email: session.email
        }, tokenInfo, {
            new: true,
            runValidators: true
        }).then(user => {
            response.json(tokenInfo);
            // Need to do something if an error occurs
        }).catch(err => console.log(err))
    });
});

app.get('/api/get-all-sports', (request, response) => {
    session.listEventTypes({
        filter: {}
    }, (err, res) => {
        response.json(res.result);
    });
});

app.get('/api/list-countries', (request, response) => {
    session.listCountries({
        filter: {
            eventTypeIds: [request.query.sportId]
        }
    }, (err, res) => {
        response.json(res.result);
    });
});

app.get('/api/list-competitions', (request, response) => {
    console.log('4')
    session.listCompetitions({
        filter: {
            eventTypeIds: [request.query.sportId],
            marketCountries: [request.query.country]
        }
    }, (err, res) => {
        response.json(res.result);
    });
});

app.get('/api/list-events', (request, response) => {
    session.listEvents({
        filter: {
            eventTypeIds: [request.query.sportId],
            marketCountries: [request.query.country]
        }
    }, (err, res) => {
        response.json(res.result);
    });
});

app.get('/api/list-events2', (request, response) => {
    session.listEvents({
        filter: {
            competitionIds: [request.query.competitionId],
            marketCountries: [request.query.country]
        }
    }, (err, res) => {
        response.json(res.result);
    });
});

app.get('/api/get-next-horse-race', (request, response) => {
    session.listMarketCatalogue({
        filter: {
            "eventTypeIds": [
                7
            ],
            "marketCountries": [
                "GB"
            ],
            "marketTypeCodes": [
                "WIN"
            ],
            "marketStartTime": {
                "from": new Date().toJSON()
            }
        },
        "sort": "FIRST_TO_START",
        "maxResults": "1",
        "marketProjection": [
            "RUNNER_DESCRIPTION",
            "RUNNER_METADATA"
        ]
    }, function(err, res) {
        console.log("Response:%s\n", JSON.stringify(res.response, null, 2));	
        response.json(res.result);
    });
});

app.get('/api/list-markets', (request, response) => {
    session.listMarketCatalogue({
        filter: {
            eventIds: [request.query.eventId]
        },
        maxResults: 1000
    }, (err, res) => {	
        response.json(res);
    });
});

app.get('/api/get-market-info', (request, response) => {
    session.listMarketCatalogue({
        filter: {
            eventIds: [request.query.eventId]
        },
        marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME', 'MARKET_DESCRIPTION', 'RUNNER_DESCRIPTION', 'RUNNER_METADATA'],
        maxResults: 1
    }, (err, res) => {
        response.json(res);
    });
});

// A call to get required params for O-auth (vendorId, vendorSecret)
app.get('/api/get-developer-application-keys', (request, response) => {
    session.getDeveloperAppKeys({
        filter: {}
    }, (err, res) => {
        var vendorId = res.result[1].appVersions[0].vendorId;
        var vendorSecret = res.result[1].appVersions[0].vendorSecret;
        response.json({
            vendorId,
            vendorSecret
        });
    });
});

const port = 3001;
app.listen(port, () => console.log(`Server started on port: ${port}`));

process.stdin.resume(); //so the program will not close instantly

const exitHandler = (options, exitCode) => {
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
};

// App is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));

// Catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));

// Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
    exit: true
}));

// Catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));

const io = require('socket.io')(8000);
io.on('connection', (client) => {

});