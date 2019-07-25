/* User details */
const USERNAME = '';
const PASSWORD = '';
const APPKEY = '';

/* Authentication */
const BetFairSession = require('./src/server/lib/session.js');

/* Betting API */
const BetFairBetting = require('./src/server/lib/betting-api/betting-api.js');

/* Account API */
const BetFairAccount = require('./src/server/lib/accounts-api/accounts-api.js');

/* Streaming API */
const BetFairStreaming = require('./src/server/lib/stream-api/stream-api.js');

class App {
	constructor () {
		this.bfSession = new BetFairSession(APPKEY);
	}
	start () {
		this.bfSession.login(USERNAME, PASSWORD).then((result) => {


			// this.bfStreaming = new BetFairStreaming();
			// this.bfStreaming.authenticate(APPKEY, this.bfSession.sessionKey);

		// this.bfSession.createDeveloperAppKeys({filter: {appName: 'sportbetting'}}, function(err, res) {
		// 	console.log(res.result);
		// });

		this.bfSession.getVendorClientId({filter: {}}, function(err, res) {
			console.log(res.result);
		});

		// this.bfSession.listMarketCatalogue({
		// 	filter: {
		// 		"eventTypeIds": [
		// 			7
		// 		],
		// 		"marketCountries": [
		// 			"GB"
		// 		],
		// 		"marketTypeCodes": [
		// 			"WIN"
		// 		],
		// 		"marketStartTime": {
		// 			"from": new Date().toJSON()
		// 		}
		// 	},
		// 	"sort": "FIRST_TO_START",
		// 	"maxResults": "1",
		// 	"marketProjection": [
		// 		"RUNNER_DESCRIPTION"
		// 	]
		// }, function(err, res) {
		//     // console.log("listCurrentOrders err=%s duration=%s", err, res.duration / 1000);
		//     // console.log("Request:%s\n", JSON.stringify(res.request, null, 2));
		//     console.log("Response:%s\n", JSON.stringify(res.response, null, 2));
		//     // cb(err, res);
		// });


// var requestFilters = '{"filter":{"eventTypeIds": [' + eventId + '],"marketCountries":["GB"],"marketTypeCodes":["WIN"],"marketStartTime":{"from":"'+jsonDate+'"}},"sort":"FIRST_TO_START","maxResults":"1","marketProjection":["RUNNER_DESCRIPTION"]}';


		// 	// Account API
		// 	this.bfAccount = new BetFairAccount(APPKEY, this.bfSession.sessionKey);
		// 	this.bfAccount.getAccountFunds().bind(this.bfBetting).then(function(funds) {
		// 		console.log(funds);
		// 	});

			// Betting API
		// 	this.bfBetting = new BetFairBetting(APPKEY, this.bfSession.sessionKey);
		// 	this.bfBetting.findEvents().bind(this.bfBetting).then(function(events) {
		// 		this.events = events;
		// 		return this.getNextAvailableHorseRace(this.events);
		// 		// Get next Horse Race
		// 	}).then(function (horseRace) {
		// 		this.horseRace = horseRace.result;
		// 		console.log(this.horseRace[0]);
		// 	});
		});
	}
}

new App().start();

// var bfStreaming = new BetFairStreaming();
// bfStreaming.authenticate(APPKEY, bfSession.sessionKey);
