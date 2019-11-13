const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const tls = require('tls');

class BetFairStreamAPI {
	constructor (openSocket) {
		this.connected = false;
		this.authenticated = false;
		this.client = null;
		this.openSocket = openSocket;
		this.bufferedStr = '';
		this.chunks = [];
	}
	authenticate (sessionKey, subscription) {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			this.connected = true;

			this.client.setEncoding('utf8');

			this.client.write('{"op": "authentication", "appKey": "' + 'qI6kop1fEslEArVO' + '", "session":"' + 'BEARER' + ' ' + sessionKey + '"}\r\n');

			if (subscription) {
				this.client.write(subscription);	
			}

			this.client.on('data', data => {
				console.log('Received: ' + data);

				// Read the data into Buffer
				const bufferedData = Buffer.from(data);

				// Convert the buffer into a String
				this.chunks.push(decoder.write(bufferedData));

				// Parse the data String into JSON Object
				try {
					const result = JSON.parse(this.chunks.join(""));

					// Connection status
					if (result.op === 'status') {
						this.authenticated = result.connectionClosed
						this.chunks = [];
					}
					
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
				console.log('end: ' + data);
			});

			this.client.on('close', () => {
				console.log('Connection closed');
				this.connected = false;
				this.authenticated = false;
			});

			this.client.on('error', err => {
				console.log('Error:' + err);
			});
		});
	}
	makeSubscription(accessToken, subscription) {
		if (this.connected && this.authenticated) {
			this.client.write(subscription);
		} else {
			this.authenticate(accessToken, subscription);
		}
	}
}

module.exports = BetFairStreamAPI;