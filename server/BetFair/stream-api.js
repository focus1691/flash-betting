'use strict';
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const tls = require('tls');

class BetFairStreamAPI {
	constructor (openSocket) {
		this.client = null;
		this.openSocket = openSocket;
		this.bufferedStr = '';
		this.chunks = [];
	}
	authenticate (subscription, sessionKey) {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			// console.log("Connected");

			this.client.setEncoding('utf8');

			this.client.write('{"op": "authentication", "appKey": "' + process.env.APP_KEY + '", "session":"' + 'BEARER' + ' ' + sessionKey + '"}\r\n');

			this.client.write(subscription);

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
						this.openSocket.emit('mcm', result.mc[0]);
						this.chunks = [];
					}
					// Order Change Message Data Found
					else if (result.op === 'ocm') {
						this.openSocket.emit('ocm', result);
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
}

module.exports = BetFairStreamAPI;