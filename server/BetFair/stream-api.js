'use strict';

const tls = require('tls');

class BetFairStreamAPI {
	constructor () {
		this.sessionKey = null;
		this.client = null
	}
	setSessionKey(sessionKey) {
		this.sessionKey = sessionKey;
	}
	authenticate () {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			console.log(`app key:${process.env.APP_KEY} session key:${this.sessionKey}`);

			this.client.write('{"op": "authentication", "appKey": "' + process.env.APP_KEY + '", "session":"' + 'BEARER' + ' ' + this.sessionKey + '"}\r\n');

			this.client.write('{"op":"marketSubscription","id":2,"marketFilter":{"marketIds":["1.162055238"]},"marketDataFilter":{"ladderLevels": 2}}\r\n');


			this.client.on('data', function(data) {
				console.log('Received: ' + data);
			});

			this.client.on('close', function() {
			    console.log('Connection closed');
			});

			this.client.on('error', function(err) {
				console.log('Error:' + err);
			});
		});
	}
}

module.exports = BetFairStreamAPI;