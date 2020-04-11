const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

const tls = require('tls');

class BetFairStreamAPI {
	constructor (openSocket) {
		this.awaitingAuthentication = false;
		this.connectionClosed = true;
		this.client = null;
		this.openSocket = openSocket;
		this.bufferedStr = '';
		this.chunks = [];
		this.subscriptions = [];
	}
	authenticate (sessionKey) {

		let options = {
			host: 'stream-api.betfair.com',
			port: 443
		}
		this.client = tls.connect(options, () => {
			console.log("Connected");

			this.client.setEncoding('utf8');

			this.client.write('{"op": "authentication", "appKey": "' + 'qI6kop1fEslEArVO' + '", "session":"' + 'BEARER' + ' ' + sessionKey + '"}\r\n');

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
						this.connectionClosed = result.connectionClosed;
						if (this.connectionClosed) {
							const {connectionClosed, errorCode, errorMessage, statusCode} = result;
							console.log('subscription-error', {connectionClosed, errorCode, errorMessage, statusCode});
							this.openSocket.emit('subscription-error', {connectionClosed, errorCode, errorMessage, statusCode});
						} else {
							this.subscriptions.forEach((subscription => this.client.write(subscription)));
						}
						this.subscriptions = [];
					}
					
					// Market Change Message Data Found
					if (result.op === 'mcm' && result.mc) {
						if (result.mc[0].marketDefinition) {
							this.openSocket.emit('market-definition', result.mc[0].marketDefinition);
						}
						this.openSocket.emit('mcm', result);
					}
					// Order Change Message Data Found
					else if (result.op === 'ocm' && result.oc) {
						this.openSocket.emit('ocm', result);
					} 
					this.chunks = [];
				} catch (e) {}
			});

			this.client.on('end', data => {
				console.log('end: ' + data);
			});

			this.client.on('close', () => {
				console.log('Connection closed');
				this.connectionClosed = true;
			});

			this.client.on('error', err => {
				console.log('Error:' + err);
			});
		});
	}
	makeSubscription(subscription, accessToken) {
		if (this.connectionClosed) {
			this.authenticate(accessToken);
			this.subscriptions.push(subscription);
		}
		else if (!this.client.connecting) {
			this.client.write(subscription);
		}
		else {
			this.subscriptions.push(subscription);
		}
	}
}

module.exports = BetFairStreamAPI;