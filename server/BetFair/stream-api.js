'use strict';
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const tls = require('tls');

class BetFairStreamAPI {
	constructor (sessionKey) {
		this.sessionKey = sessionKey;
		this.client = null;
		this.openSocket = null;
		this.bufferedStr = '';
	}
	authenticate (data, openSocket) {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			console.log(`app key:${process.env.APP_KEY} session key:${this.sessionKey}`);

			this.client.write('{"op": "authentication", "appKey": "' + process.env.APP_KEY + '", "session":"' + 'BEARER' + ' ' + this.sessionKey + '"}\r\n');

			this.client.write(`{"op":"marketSubscription","id":2,"marketFilter":{"marketIds":["${data.marketId}"]},"marketDataFilter":{"ladderLevels": 10}}\r\n`);

			this.client.on('data', function(data) {
				// console.log('Received: ' + data);
				//
				// Read the data into Buffer
				const bufferedData = Buffer.from(data);

				// Convert the buffer into a String
				this.bufferedStr = decoder.write(bufferedData);
				this.bufferedStr = this.bufferedStr.split('Received: ').join('');
				// console.log(this.bufferedStr);

				// Parse the data String into JSON Object
				try {
					const result = JSON.parse(this.bufferedStr);
					this.bufferedStr = '';

					if (result.op === 'mcm' && result.mc) {

						//** Correct format: result.mc[0].rc **/
						console.log(result.mc[0].rc);

						openSocket.emit('mcm', result.mc[0]);
					}
				} catch (e) {
					console.log('err', e);
				}
			});

			this.client.on('close', function() {
			    console.log('Connection closed');
			});

			this.client.on('error', function(err) {
				console.log('Error:' + err);
			});
		});
	}
	formatJSON (str) {
		return str.split('Received:').join('');
	}
}

module.exports = BetFairStreamAPI;