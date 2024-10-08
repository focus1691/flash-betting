const { StringDecoder } = require('string_decoder');
const tls = require('tls');

const decoder = new StringDecoder('utf8');

class BetFairStreamAPI {
  constructor(socket) {
    this.connectionClosed = true;
    this.client = null;
    this.socket = socket;
    this.chunks = [];
    this.subscriptions = [];
    this.isTestDisconnected = false;
  }

  authenticate(sessionKey) {
    const options = {
      host: 'stream-api.betfair.com',
      port: 443,
    };
    this.client = tls.connect(options, () => {
      console.log(`Connected Socket: ${this.socket.id}, Session: ${sessionKey}`);

      this.client.setEncoding('utf8');

      const authParams = {
        op: 'authentication',
        appKey: process.env.APP_KEY,
        session: sessionKey
      }

      this.client.write(`${JSON.stringify(authParams)}\r\n`);

      this.connectedAt = new Date().getTime();

      this.client.on('data', (data) => {

        // Read the data into Buffer
        const bufferedData = Buffer.from(data);

        // Convert the buffer into a String
        this.chunks.push(decoder.write(bufferedData));

        // Parse the data String into JSON Object
        try {
          const result = JSON.parse(this.chunks.join(''));
          if (result.op === 'status') {
            if (result.connectionClosed) {
              console.warn(`status with connection closed ${this.socket.id}`);
              console.log(result);
              const { errorCode, errorMessage } = result;
              this.socket.emit('connection-disconnected', { errorCode, errorMessage });
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
        console.log(`Connection end: ${data} ${this.socket.id}`);
      });

      this.client.on('close', (data) => {
        console.log(`Connection closed: ${data} ${this.socket.id}`);
        if (!this.connectionClosed) {
          this.socket.emit('connection-disconnected', { errorMessage: 'Disconnected from the market. Reconnect to start receiving market data.' });
          this.connectionClosed = true;
        }
      });

      this.client.on('error', (data) => {
        console.log(`Error: ${data} ${this.socket.id}`);
      });
    });
  }

  subscribe(sessionKey, params) {
    if (this.connectionClosed || !this.client) {
      this.authenticate(sessionKey);
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

  makeMarketSubscription(sessionKey, marketId, initialClk, clk) {
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

    this.subscribe(sessionKey, params);
  }
}

BetFairStreamAPI.id = 1;

module.exports = BetFairStreamAPI;
