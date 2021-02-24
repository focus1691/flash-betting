const electron = require('electron');

const electronApp = electron.app;
const { BrowserWindow } = electron;

const path = require('path');

let mainWindow;

const express = require('express');

const fetch = require('node-fetch');

const app = express();
// This adds environment-specific variables on new lines in the form of NAME=VALUE
// Access with process.env
require('dotenv').config();

// The BetFair session class below contains all the methods
// to call the BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('../server/BetFair/session.js');
const ExchangeStream = require('../server/BetFair/stream-api.js');

const vendor = new BetFairSession(process.env.APP_KEY || 'qI6kop1fEslEArVO');
const betfair = new BetFairSession(process.env.APP_KEY || 'qI6kop1fEslEArVO');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const database = require('../server/Database/helper');
const User = require('../server/Database/models/users');

const publicPath = path.join(__dirname, '../');
app.use(express.static(path.join(publicPath, 'build')));

app.get('/', (req, res) => {
  res.sendFile(`${publicPath}build/index.html`);
});

app.get('/dashboard', (req, res) => {
  res.sendFile(`${publicPath}build/index.html`);
});
app.get('/getClosedMarketStats', (req, res) => {
  res.sendFile(`${publicPath}build/index.html`);
});
app.get('/authentication', (req, res) => {
  res.sendFile(`${publicPath}build/index.html`);
});
app.get('/validation', (req, res) => {
  res.sendFile(`${publicPath}build/index.html`);
});
app.get('/logout', (req, res) => {
  res.sendFile(`${publicPath}build/index.html`);
});

app.get('/api/get-subscription-status', (request, response) => {
  betfair.isAccountSubscribedToWebApp(
    {
      vendorId: 'qI6kop1fEslEArVO',
    },
    async (err, res) => {
      response.json({
        isSubscribed: res.result,
        accessToken: await database.getToken(betfair.email),
      });
    },
  );
});

app.get('/api/request-access-token', async (request, response) => {
  const params = {
    client_id: '74333',
    grant_type: request.query.tokenType,
    client_secret: '6d912070-7cda-47c9-819f-20ea616fd35c',
  };

  const token = async () => {
    vendor.login(process.env.BETFAIR_USER || 'traderjosh', process.env.BETFAIR_PASS || 'r5gYGPjpLgaP!rj').then((res) => {
      if (res.error) {
        response.status(400).json(res);
      } else {
        vendor.token(params, (err, res) => {
          if (res.error) {
            response.status(400).json(res);
          } else {
            const tokenInfo = {
              accessToken: res.result.access_token,
              expiresIn: new Date(new Date().setSeconds(new Date().getSeconds() + res.result.expires_in)),
              refreshToken: res.result.refresh_token,
            };
            // Update the user details with the token information
            database.setToken(betfair.email, tokenInfo).then(() => { response.json(tokenInfo); });
          }
        });
      }
    });
  };

  switch (request.query.tokenType) {
    case 'REFRESH_TOKEN':
      var storedTokenData = await database.getTokenData(betfair.email);
      if (storedTokenData.expiresIn < new Date()) {
        params.refresh_token = storedTokenData.refreshToken;
        token();
      } else {
        response.json(storedTokenData);
      }
      break;
    case 'AUTHORIZATION_CODE':
      params.code = request.query.code;
      token();
      break;
    default:
  }
});

app.get('/api/login', (request, response) => {
  betfair.login(request.query.user, request.query.pass)
    .then((res) => {
      response.json({ sessionKey: res.sessionKey });
      // Check if user exists, if doesn't exist, then create a new user
      database.setUser(request.query.user, res.sessionKey);
    }).bind(this).catch((err) => response.json({ error: err }));
});

app.get('/api/logout', (request, response) => {
  betfair.logout().then((res) => response.json(res)).bind(this)
    .catch((err) => response.json({ error: err }));
});

app.get('/api/get-account-balance', (request, response) => {
  betfair.getAccountFunds(
    {
      filter: {},
    },
    (err, res) => {
      if (res.error) response.status(400).json(res);
      else {
        response.json({
          balance: res.result.availableToBetBalance,
        });
      }
    },
  );
});

app.get('/api/get-account-details', (request, response) => {
  betfair.getAccountDetails(
    {
      filter: {},
    },
    (err, res) => {
      if (res.error) response.status(400).json(res);
      else {
        response.json({
          name: res.result.firstName,
          countryCode: res.result.countryCode,
          currencyCode: res.result.currencyCode,
          localeCode: res.result.localeCode,
        });
      }
    },
  );
});

app.get('/api/get-events-with-active-bets', (request, response) => {
  betfair.listCurrentOrders(
    {
      filter: {},
    },
    async (err, res) => {
      if (!res.result) {
        response.json({});
      } else {
        const filteredOrders = res.result.currentOrders = await res.result.currentOrders.filter((data, index, order) => index === order.findIndex((t) => (

          t.marketId === data.marketId
        ))).map((order) => order.marketId);

        betfair.listMarketCatalogue(
          {
            filter: {
              marketIds: filteredOrders,
            },
            maxResults: 100,
          },
          (err, res) => {
            response.json(res.result);
          },
        );
      }
    },
  );
});

app.get('/api/get-all-bets', (request, response) => {
  database.getAllOrders(betfair.email).then((res) => {
    response.json(res);
  });
});

app.post('/api/save-bet', (request, response) => {
  database.saveOrder(betfair.email, request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/remove-bet', (request, response) => {
  database.removeOrders(betfair.email, request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/fetch-all-sports', async (request, response) => {
  const data = await vendor.login(process.env.BETFAIR_USER || 'traderjosh', process.env.BETFAIR_PASS || 'r5gYGPjpLgaP!rj');

  if (!data) {
    response.sendStatus(400);
  } else {
    const headers = {
      'X-Application': process.env.APP_KEY || 'qI6kop1fEslEArVO',
      'X-Authentication': data.sessionKey,
    };
    fetch('https://api.betfair.com/exchange/betting/rest/v1/en/navigation/menu.json', { headers })
      .then((res) => res.json())
      .then((res) => {
        res.children.forEach((item) => {
          betfair.allSports[item.id] = item.children;
        });
        response.sendStatus(200);
      }).catch((err) => {
        response.sendStatus(400);
      });
  }
});

app.get('/api/fetch-sport-data', (request, response) => (betfair.allSports[request.query.id]
  ? response.json(betfair.allSports[request.query.id])
  : response.sendStatus(400).send('All Sports contains no data')));

app.get('/api/get-all-sports', (request, response) => {
  betfair.listEventTypes(
    {
      filter: {},
    },
    (err, res) => {
      if (res.error) response.sendStatus(400).json();
      else response.json(res.result);
    },
  );
});

app.get('/api/list-todays-card', (request, response) => {
  betfair.listMarketCatalogue({
    filter: {
      eventTypeIds: [
        request.query.id,
      ],
      marketTypeCodes: request.query.marketTypes !== 'undefined' ? [
        request.query.marketTypes,
      ] : undefined,
      marketCountries: request.query.country !== 'undefined' ? JSON.parse(request.query.country) : undefined,
      marketStartTime: {
        from: new Date(new Date().setSeconds(new Date().getSeconds() - 3600)).toJSON(),
        to: new Date(new Date().setSeconds(new Date().getSeconds() + 86400)).toJSON(),
      },
    },
    sort: 'FIRST_TO_START',
    maxResults: '1000',
    marketProjection: [
      'COMPETITION',
      'EVENT',
      'EVENT_TYPE',
      'MARKET_START_TIME',
    ],
  }, (err, res) => {
    if (res.response.error) {
      response.sendStatus(400);
      return;
    }

    // if its the next day, we have to put the date
    const mappedResponseNames = res.result.map((item) => {
      const marketStartTime = new Date(item.marketStartTime);
      const currentDay = new Date(Date.now()).getDay();
      const marketStartDay = marketStartTime.getDay();
      const marketStartOnDiffDay = marketStartDay > currentDay || marketStartDay < currentDay;

      const dateSettings = { hour12: false };
      if (marketStartOnDiffDay) {
        dateSettings.weekday = 'short';
      }
      const marketStartDate = marketStartTime.toLocaleTimeString('en-us', dateSettings);
      return Object.assign(item, { marketName: `${marketStartDate} ${item.event.venue} ${item.marketName}` });
    });

    const sortByTime = (a, b) => Date.parse(a.marketStartTime) - Date.parse(b.marketStartTime);

    const sortedResponse = mappedResponseNames.sort(sortByTime);

    const mappedResponse = sortedResponse.map((item) => ({
      id: item.marketId,
      name: item.marketName,
      type: 'MARKET',
    }));

    response.json(mappedResponse);
  });
});

app.get('/api/list-market-pl', (request, response) => {
  betfair.listMarketProfitAndLoss({
    marketIds: [request.query.marketId],
  },
  (err, res) => {
    response.json(res);
  });
});

app.get('/api/get-market-info', (request, response) => {
  betfair.listMarketCatalogue(
    {
      filter: {
        marketIds: [request.query.marketId],
      },
      marketProjection: [
        'COMPETITION',
        'EVENT',
        'EVENT_TYPE',
        'MARKET_START_TIME',
        'MARKET_DESCRIPTION',
        'RUNNER_DESCRIPTION',
        'RUNNER_METADATA',
      ],
      maxResults: 1,
    },
    (err, res) => {
      response.json(res);
    },
  );
});

app.get('/api/list-market-book', (request, response) => {
  betfair.listMarketBook(
    {
      marketIds: [request.query.marketId],
      priceProjection: { priceData: ['EX_TRADED', 'EX_ALL_OFFERS'] },
    },
    (err, res) => {
      response.json(res);
    },
  );
});

app.post('/api/place-order', (request, response) => {
  betfair.placeOrders(
    {
      marketId: request.body.marketId,
      instructions: [
        {
          selectionId: request.body.selectionId,
          side: request.body.side,
          orderType: 'LIMIT',
          limitOrder: {
            size: request.body.size,
            price: request.body.price,
          },
        },
      ],
      customerStrategyRef: request.body.customerStrategyRef,
    },
    (err, res) => {
      if (res.error) {
        response.sendStatus(400);
      } else {
        response.json(res.result);
      }
    },
  );
});

app.post('/api/update-orders', (request, response) => {
  betfair.placeOrders({
    marketId: request.body.marketId,
    instructions: [{
      betId: request.body.betId,
      newPersistenceType: 'PERSIST',
    }],
    customerStrategyRef: request.body.customerStrategyRef,
  }, (err, res) => {
    if (res.error) {
      response.sendStatus(400);
    } else {
      response.json(res.result);
    }
  });
});

app.post('/api/replace-orders', (request, response) => {
  betfair.replaceOrders({
    marketId: request.body.marketId,
    instructions: [{
      betId: request.body.betId,
      newPrice: request.body.newPrice,
    }],
    customerRef: request.body.customerStrategyRef,
  }, (err, res) => {
    if (res.error) {
      response.sendStatus(400);
    } else {
      response.json(res.result);
    }
  });
});

app.get('/api/listCurrentOrders', (request, response) => {
  betfair.listCurrentOrders({
    marketIds: [request.query.marketId],
  },
  (err, res) => {
    response.json(res.result);
  });
});

app.get('/api/list-order-to-duplicate', (request, response) => {
  betfair.listCurrentOrders({
    marketIds: [request.query.marketId],
    OrderProjection: 'EXECUTABLE',
    SortDir: 'LATEST_TO_EARLIEST',

  },
  (err, res) => {
    response.json(res.result);
  });
});

app.post('/api/cancel-order', (request, response) => {
  betfair.cancelOrders(
    {
      marketId: request.body.marketId,
      instructions: [
        {
          betId: request.body.betId,
          sizeReduction: request.body.sizeReduction,
        },
      ],
      customerRef: request.body.customerRef,
    },
    (err, res) => {
      response.json(res.result);
    },
  );
});

process.stdin.resume(); // so the program will not close instantly

const exitHandler = (options, exitCode) => {
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
};

// App is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// Catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// Catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// Catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

const port = process.env.PORT || 3001;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(port, () => console.log(`Server started on port: ${port}`));

let id = 1;
io.on('connection', async (client) => {
  let exchangeStream = new ExchangeStream(client);

  // Subscribe to market
  client.on('market-subscription', async (data) => {
    const accessToken = await database.getToken(betfair.email);

    const marketSubscription = `{"op":"marketSubscription","id":${id++},"marketFilter":{"marketIds":["${data.marketId}"]},"marketDataFilter":{"ladderLevels": 2, "fields": [ "EX_ALL_OFFERS", "EX_TRADED", "EX_TRADED_VOL", "EX_LTP", "EX_MARKET_DEF" ]}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, accessToken);
  });
  client.on('market-resubscription', async (data) => {
    const accessToken = await database.getToken(betfair.email);
    const marketSubscription = `{"op":"marketSubscription","id":${id++},"initialClk":${data.initialClk},"clk":${data.clk},marketFilter":{"marketIds":["${data.marketId}"]},"marketDataFilter":{"ladderLevels": 2, "fields": [ "EX_ALL_OFFERS", "EX_TRADED", "EX_TRADED_VOL", "EX_LTP", "EX_MARKET_DEF" ]}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, accessToken);
  });
  // Subscribe to orders
  client.on('order-subscription', async (data) => {
    const accessToken = await database.getToken(betfair.email);
    const orderSubscription = `{"op":"orderSubscription","orderFilter":{"includeOverallPosition":false, "customerStrategyRefs":${data.customerStrategyRefs}},"segmentationEnabled":true}\r\n`;
    exchangeStream.makeSubscription(orderSubscription, accessToken);
  });
  client.on('disconnect', async () => {
    const accessToken = await database.getToken(betfair.email);
    const marketSubscription = `{"op":"marketSubscription","id":${id++},"marketFilter":{"marketIds":[""]},"marketDataFilter":{"ladderLevels": 2}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, accessToken);
    exchangeStream.client.destroy();

    exchangeStream = null;
  });
});

function createWindow() {
  const screenSize = electron.screen.getPrimaryDisplay().size;
  mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file:///${__dirname}/navigation-index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

electronApp.on('ready', createWindow);

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit();
  }
});

electronApp.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
