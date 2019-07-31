// The BetFair session class below contains all the methods to call the
// BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('./src/server/lib/session.js');

/* User details */
const USERNAME = 'joshbetting30@yahoo.com';
const PASSWORD = 'dUgneBc]p6>V5wF,';
const APPKEY = '9ARELQ7SYtAsy7G4';

const io = require('socket.io')(8000);

io.on('connection', (client) => {
	// Here you can start emitting events to the client 
	console.log('connection');

	this.bfSession = new BetFairSession(APPKEY);

	this.bfSession.login(USERNAME, PASSWORD).then((result) => {

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
		this.bfSession.listMarketCatalogue(exampleFilter, function(err, res) {
		    // console.log("Response:%s\n", JSON.stringify(res.response, null, 2));
		});

		// A call to get the vendor id, which I think is required for O-auth
		this.bfSession.getDeveloperAppKeys({filter: {}}, function(err, res) {
			console.log(res.result[0]);
			// console.log(`vendor client id: ${res}`);
		});

		// Account details
		this.bfSession.getAccountFunds({filter: {}}, function(err, res) {
			// console.log(res.result);
		});
	});
});