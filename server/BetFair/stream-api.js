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
		this.chunks = [];
	}
	authenticate (data, openSocket) {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			this.client.setEncoding('utf8');

			this.client.write('{"op": "authentication", "appKey": "' + process.env.APP_KEY + '", "session":"' + 'BEARER' + ' ' + this.sessionKey + '"}\r\n');

			this.client.write(`{"op":"marketSubscription","id":2,"marketFilter":{"marketIds":["${data.marketId}"]},"marketDataFilter":{"ladderLevels": 10}}\r\n`);

			this.client.on('data', data => {
				// console.log('Received: ' + data);

				// Read the data into Buffer
				const bufferedData = Buffer.from(data);

				// Convert the buffer into a String
				this.chunks.push(decoder.write(bufferedData));

				// Parse the data String into JSON Object
				try {
					const result = JSON.parse(this.chunks.join(""));
					
					// Market Change Message Data Found
					if (result.op === 'mcm' && result.mc) {
						console.log(result.mc[0].marketDefinition.runners);
						openSocket.emit('mcm', result.mc[0]);
						this.chunks = [];
					}
					// Order Change Message Data Found
					else if (result.op === 'ocm') {
						openSocket.emit('ocm', result);
						this.chunks = [];
					} else {
						this.chunks = [];
					}
				} catch (e) {
					// console.log('err', e);
				}
			});

			this.client.on('end', data => {
				console.log(data);
			});

			this.client.on('close', () => {
				console.log('Connection closed');
			});

			this.client.on('error', err => {
				console.log('Error:' + err);
			});
		});
	}
	subscribeToMarket (data) {
		this.client.write(`{"op":"marketSubscription","id":2,"marketFilter":{"marketIds":["${data.marketId}"]},"marketDataFilter":{"ladderLevels": 10}}\r\n`);
	}

	subscribeToOrder (data) { 
		this.client.write(`{"op":"orderSubscription","orderFilter":{"includeOverallPosition":false, "customerStrategyRefs":["${data.strategyRef}"]},"segmentationEnabled":true}\r\n`);
	}
}

module.exports = BetFairStreamAPI;