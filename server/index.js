// The BetFair session class below contains all the methods to call the
// BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('./session.js');

/* User details */
const USERNAME = 'joshbetting30@yahoo.com';
const PASSWORD = 'K%xsf6*Y\'{N';
const APPKEY = '9ARELQ7SYtAsy7G4';
const io = require('socket.io')(8000);

// http://identitysso.betfair.com/view/vendor-login?client_id=72532&response_type=code&redirect_uri=google

io.on('connection', (client) => {
	// Here you can start emitting events to the client 
	console.log('connection');

	this.bfSession = new BetFairSession(APPKEY);

	this.bfSession.login(USERNAME, PASSWORD).then((result) => {

		var tokenFilter = {
			filter: {
				"client_id": "72532",
				"client_secret": "d67440f4-c318-42c8-bba7-31cad08124d7",
				"grant_type": "AUTHORIZATION_CODE",
				"code": "CODE"
			}
		}

		this.bfSession.token(tokenFilter, function(err, res) {
			// console.log(res);
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
		    // console.log("Response:%s\n", JSON.stringify(res.response, null, 2));
		// });

		// A call to get the vendor id, which I think is required for O-auth
		// this.bfSession.getDeveloperAppKeys({filter: {}}, function(err, res) {
		// 	var vendorId = res.result[0].appVersions[0].vendorId;
		// 	var vendorSecret = res.result[0].appVersions[0].vendorSecret;
		// 	console.log(vendorId, vendorSecret);
		// 	console.log(`vendor client id: ${res}`);
		// });

		// Account details
		this.bfSession.getAccountFunds({filter: {}}, function(err, res) {
			console.log(res.result);
			client.emit('balance', res.result.availableToBetBalance);
		});
	});
});