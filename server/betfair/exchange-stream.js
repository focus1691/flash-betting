const { StringDecoder } = require('string_decoder');
const { clearInterval } = require('timers');

const decoder = new StringDecoder('utf8');

const tls = require('tls');

const testWaitTime = 20 * 1000;

class BetFairStreamAPI {
  constructor(socket) {
    this.connectionClosed = true;
    this.client = null;
    this.socket = socket;
    this.chunks = [];
    this.updates = [];
    this.subscriptions = [];
    this.isTestDisconnected = false;
    this.messageSender = null;
  }

  authenticate(accessToken) {
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
        session: `BEARER ${accessToken}`
      }

      this.client.write(`${JSON.stringify(authParams)}\r\n`);

      this.connectedAt = new Date().getTime();

      this.messageSender = setInterval(this.sendUpdates.bind(this), 250);

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
          this.updates.push(result);
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
        this.messageSender = clearInterval(this.messageSender);
      });

      this.client.on('error', (data) => {
        console.log(`Error: ${data}`);
      });
    });
  }

  sendUpdates() {
    try {
      const result = this.updates.shift();
      if (result) {
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
      }
    } catch (error) {
      //
    }
  }

  subscribe(accessToken, params) {
    if (this.connectionClosed || !this.client) {
      this.authenticate(accessToken);
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

  makeMarketSubscription(accessToken, marketId, initialClk, clk) {
    const params = {
      op: 'marketSubscription',
      id: BetFairStreamAPI.id += 1,
      marketFilter: {
        marketIds: [marketId],
      },
      marketDataFilter: {
        fields: ['EX_ALL_OFFERS', 'EX_TRADED', 'EX_TRADED_VOL', 'EX_LTP', 'EX_MARKET_DEF'],
      },
    }

    if (initialClk) {
      params.initialClk = initialClk;
    }

    if (clk) {
      params.clk = clk;
    }

    this.subscribe(accessToken, params);
  }

  makeOrderSubscription(accessToken, customerStrategyRefs) {
    const params = {
      op: 'orderSubscription',
      orderFilter: {
        includeOverallPosition: false,
        customerStrategyRefs,
      },
      segmentationEnabled: true,
    }
    this.subscribe(accessToken, params);
  }
}

BetFairStreamAPI.id = 1;

module.exports = BetFairStreamAPI;
