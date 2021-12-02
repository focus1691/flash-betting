const { StringDecoder } = require('string_decoder');

const decoder = new StringDecoder('utf8');

const tls = require('tls');

const testWaitTime = 20 * 1000;

class BetFairStreamAPI {
  constructor(socket, accessToken) {
    this.connectionClosed = true;
    this.client = null;
    this.socket = socket;
    this.accessToken = accessToken;
    this.chunks = [];
    this.subscriptions = [];
    this.isTestDisconnected = false;
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

      this.connectedAt = new Date().getTime();

      this.client.on('data', (data) => {

        const now = new Date().getTime();

        // Read the data into Buffer
        const bufferedData = Buffer.from(data);

        // Convert the buffer into a String
        this.chunks.push(decoder.write(bufferedData));

        // For debug purposes, simulate a connection disconnect
        if (process.env.BETFAIR_CONNECTION_ERROR === 'test' && !this.isTestDisconnected && now - this.connectedAt > testWaitTime) {
          console.log('simulating a disconnect from a Exchange Streaming connection')
          if (this.client) {
            this.client.destroy();
          }
          this.socket.emit('subscription-error', {
            errorCode: 'A_TEST_ERROR_CODE',
            errorMessage: 'This is a simulated socket disconnect from the Streaming API',
          });
          this.isTestDisconnected = true;
        }

        // Parse the data String into JSON Object
        try {
          const result = JSON.parse(this.chunks.join(''));
          console.log(result);

          console.log(process.env.BETFAIR_CONNECTION_ERROR === 'test', !this.isTestDisconnected && now - this.connectedAt > testWaitTime, now - this.connectedAt);

          // Connection status
          if (result.op === 'status') {
            if (result.connectionClosed) {
              console.log('status with connection closed', result);
              const { errorCode, errorMessage } = result;
              this.socket.emit('subscription-error', { errorCode, errorMessage });
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
        if (!this.connectionClosed) {
          this.socket.emit('subscription-error', { errorMessage: 'Disconnected from the market. Reconnect to start receiving market data.' });
          this.connectionClosed = true;
        }
      });

      this.client.on('error', (data) => {
        console.log(`Error: ${data}`);
      });
    });
  }

  subscribe(params) {
    if (this.connectionClosed || !this.client) {
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
        id: BetFairStreamAPI.id += 1,
        marketFilter: {
          marketIds: [],
        },
      };
      this.client.write(`${JSON.stringify(marketSubscriptionParams)}\r\n`);
      this.client.destroy();
      this.connectionClosed = true;
    }
  }

  makeMarketSubscription(marketId, initialClk, clk) {
    const params = {
      op: 'marketSubscription',
      id: BetFairStreamAPI.id += 1,
      marketFilter: {
        marketIds: [marketId],
      },
      marketDataFilter: {
        ladderLevels: 2,
        fields: ['EX_ALL_OFFERS', 'EX_TRADED', 'EX_TRADED_VOL', 'EX_LTP', 'EX_MARKET_DEF'],
      },  
    }

    if (initialClk) {
      params.initialClk = initialClk;
    }

    if (clk) {
      params.clk = clk;
    }

    this.subscribe(params);
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

BetFairStreamAPI.id = 1;

module.exports = BetFairStreamAPI;
