'use strict';

const tls = require('tls');

class BetFairStreamAPI {
	constructor () {
		this.applicationKey = null;
		this.sessionKey = null;
		this.client = null
	}
	authenticate (applicationKey, sessionKey) {
		this.applicationKey = applicationKey;
		this.sessionKey = sessionKey;

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			console.log(this.applicationKey, this.sessionKey);

			this.client.write('{"op": "authentication", "appKey": "' + this.applicationKey + '", "session":"' + 'BEARER' + ' ' + this.sessionKey + '"}\r\n');
			this.client.write('{"op":"marketSubscription","id":2,"marketFilter":{"marketIds":["1.130856098"]},"marketDataFilter":{}}\r\n');


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