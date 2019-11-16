const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const tls = require('tls');

class BetFairStreamAPI {
	constructor (openSocket) {
		this.awaitingAuthentication = false;
		this.client = null;
		this.openSocket = openSocket;
		this.bufferedStr = '';
		this.chunks = [];
		this.subscriptions = [];
	}
	connect() {

	}
	authenticate (sessionKey) {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			this.client.setEncoding('utf8');
			
			if (this.client.authorized) {
				this.client.write('{"op": "authentication", "appKey": "' + 'qI6kop1fEslEArVO' + '", "session":"' + 'BEARER' + ' ' + sessionKey + '"}\r\n');
			}

			this.client.on('data', data => {
				// console.log('Received: ' + data);

				// Read the data into Buffer
				const bufferedData = Buffer.from(data);

				// Convert the buffer into a String
				this.chunks.push(decoder.write(bufferedData));

				// Parse the data String into JSON Object
				try {
					const result = JSON.parse(this.chunks.join(""));

					// Connection status
					if (result.op === 'status') {
						if (result.connectionClosed === false) {
							for (var i = 0; i < this.subscriptions.length; i++) {
								this.client.write(this.subscriptions[i]);
							}
						}
						this.subscriptions = [];
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
				} catch (e) {}
			});

			this.client.on('end', data => {
				console.log('end: ' + data);
			});

			this.client.on('close', () => {
				console.log('Connection closed');
				this.authenticated = false;
			});

			this.client.on('error', err => {
				console.log('Error:' + err);
			});
		});
	}
	makeSubscription(subscription) {
		if (!this.client.connecting && this.client.authorized) {
			this.client.write(subscription);
		}
		else {
			this.subscriptions.push(subscription);
		}
	}
}

module.exports = BetFairStreamAPI;