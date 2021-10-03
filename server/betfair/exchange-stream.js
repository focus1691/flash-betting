const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf8');

const tls = require('tls');

let isDisconnected = false;

class BetFairStreamAPI {
  constructor(socket, accessToken) {
    this.id = 1;
    this.connectionClosed = true;
    this.client = null;
    this.socket = socket;
    this.accessToken = accessToken;
    this.chunks = [];
    this.subscriptions = [];
  }

  authenticate() {
    const options = {
      host: 'stream-api.betfair.com',
      port: 443,
    };
    this.client = tls.connect(options, () => {
      console.log('Connected');

      this.client.setEncoding('utf8');

      const authParams = {
        op: 'authentication',
        appKey: process.env.APP_KEY,
        session: `BEARER ${this.accessToken}`
      }
      console.log(authParams);

      this.client.write(`${JSON.stringify(authParams)}\r\n`);

      this.client.on('data', (data) => {

        // Read the data into Buffer
        const bufferedData = Buffer.from(data);

        // Convert the buffer into a String
        this.chunks.push(decoder.write(bufferedData));

        // Parse the data String into JSON Object
        try {
          const result = JSON.parse(this.chunks.join(''));
          console.log(result);

          // Connection status
          if (result.op === 'status') {
            if (result.connectionClosed) {
              console.log('status with connection closed', result);
              const {
                connectionClosed, errorCode, errorMessage, statusCode,
              } = result;
              this.socket.emit('subscription-error', {
                connectionClosed, errorCode, errorMessage, statusCode,
              });
            }
            // For debug purposes, simulate a connection disconnect
            else if (process.env.TESTING_CONNECTION_ERROR === true && !isDisconnected) {
              this.client.destroy();
              isDisconnected = true;
            } 
            else {
              for (let i = 0; i < this.subscriptions.length; i += 1) {
                this.client.write(`${JSON.stringify(this.subscriptions[i])}\r\n`);
              }
            }
            this.subscriptions = [];
            this.connectionClosed = result.connectionClosed;
          }

          // Market Change Message Data Found
          if (result.op === 'mcm' && result.mc) {
            this.socket.emit('mcm', result);
          }
          // Order Change Message Data Found
          else if (result.op === 'ocm' && result.oc) {
            this.socket.emit('ocm', result);
          }
          this.chunks = [];
        } catch (e) {
          //
        }
      });

      this.client.on('end', (data) => {
        console.log(`Connection end: ${data}`);
      });

      this.client.on('close', (data) => {
        console.log(`Connection closed: ${data}`);
        this.connectionClosed = true;
      });

      this.client.on('error', (data) => {
        console.log(`Error: ${data}`);
      });
    });
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  subscribe(params) {
    if (this.connectionClosed) {
      this.authenticate();
      this.subscriptions.push(params);
    } else {
      this.client.write(`${JSON.stringify(params)}\r\n`);
    }
  }

  unsubscribe() {
    if (this.client) {
      const marketSubscriptionParams = {
        op: 'marketSubscription',
        id: this.id += 1,
        marketFilter: {
          marketIds: [],
        },
        marketDataFilter: {
          ladderLevels: 2,
        },
      };
      this.client.write(`${JSON.stringify(marketSubscriptionParams)}\r\n`);
      this.client.destroy();
    }
  }

  makeMarketSubscription(marketId) {
    this.subscribe({
      op: 'marketSubscription',
      id: this.id += 1,
      marketFilter: {
        marketIds: [marketId],
      },
      marketDataFilter: {
        ladderLevels: 2,
        fields: ['EX_ALL_OFFERS', 'EX_TRADED', 'EX_TRADED_VOL', 'EX_LTP', 'EX_MARKET_DEF'],
      },
    });
  }

  makeMarketResubscription(initialClk, clk, marketId) {
    this.subscribe({
      op: 'marketSubscription',
      id: this.id += 1,
      initialClk,
      clk,

      marketFilter: {
        marketIds: [marketId],
      },
      marketDataFilter: {
        ladderLevels: 2,
        fields: ['EX_ALL_OFFERS', 'EX_TRADED', 'EX_TRADED_VOL', 'EX_LTP', 'EX_MARKET_DEF'],
      },
    });
  }

  makeOrderSubscription(customerStrategyRefs) {
    this.subscribe({
      op: 'orderSubscription',
      orderFilter: {
        includeOverallPosition: false,
        customerStrategyRefs,
      },
      segmentationEnabled: true,
    });
  }
}

module.exports = BetFairStreamAPI;
