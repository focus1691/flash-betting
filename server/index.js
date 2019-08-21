// The BetFair session class below contains all the methods to call the
// BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('./session.js');

/* User details */
const USERNAME = 'joshbetting30@yahoo.com';
const PASSWORD = '!fBq2JiCDNrNfkj';
const APPKEY = 'qI6kop1fEslEArVO';
const io = require('socket.io')(8000);

io.on('connection', (client) => {
    this.bfSession = new BetFairSession(APPKEY);

    client.on('load_session', data => {
        this.bfSession.setActiveSession(data.sessionKey);
    });

    client.on('login', data => {
        this.bfSession.login(data.user, data.pass).then((res) => {
            client.emit('loggedIn', {
                sessionKey: res.sessionKey
            });
        }).bind(this).catch(err => client.emit('loggedIn', {
            error: err
        }));
    });

    client.on('get_account_balance', () => {
        this.bfSession.getAccountFunds({
            filter: {}
        }, function (err, res) {
            if (err) client.emit('account_balance', {
                error: err
            });
            else client.emit('account_balance', {
                balance: res.result.availableToBetBalance
            });
        }.bind(this));
    });

    client.on('get_account_details', () => {;
        this.bfSession.getAccountDetails({
            filter: {}
        }, function (err, res) {
            if (err) client.emit('account_details', {
                error: err
            });
            else client.emit('account_details', {
                details: res.result.firstName
            });
        }.bind(this));
    });


    client.on('request_access_token', code => {
        var tokenFilter = {
            "client_id": "74333",
            "grant_type": "AUTHORIZATION_CODE",
            "client_secret": "6d912070-7cda-47c9-819f-20ea616fd35c",
            "code": code
        }
        this.bfSession.token(tokenFilter, (err, res) => {
            client.emit('access_token', {
                accessToken: res.result.access_token,
                expiresIn: res.result.expires_in,
                refreshToken: res.result.refresh_token
            });
        });
    });

    client.on('get_all_sports', data => {
        this.bfSession.sessionKey = data.sessionKey;
        this.bfSession.listEventTypes({
            filter: {}
        }, (err, res) => {
            client.emit('all_sports', {
                sports: res.result
            });
        });
	});
	
	client.on('get_developer_app_keys', () => {
		// A call to get required params for O-auth (vendorId, vendorSecret)
		this.bfSession.getDeveloperAppKeys({filter: {}}, (err, res) => {
			var vendorId = res.result[1].appVersions[0].vendorId;
			var vendorSecret = res.result[1].appVersions[0].vendorSecret;
		});
	});

    // An sample filter used to call BetFair method 'listMarketCatalogue'
    // with the event type (horse racing = 7). Normally you would call
    // 'listEvents' to get the ids of the event you want to search.
    var exampleFilter = {
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
            "RUNNER_DESCRIPTION"
        ]
	}
    // Query to find market information for the example filter
    // this.bfSession.listMarketCatalogue(exampleFilter, function(err, res) {
	// 	console.log("Response:%s\n", JSON.stringify(res.response, null, 2));	
	// });
});