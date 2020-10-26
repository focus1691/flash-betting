require('dotenv').config();

const braintree = require('braintree');
const _ = require('lodash');

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});

const express = require('express');

const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

const fetch = require('node-fetch');

const bodyParser = require('body-parser');

// The BetFair session class below contains all the methods
// to call the BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('./BetFair/session.js');
const ExchangeStream = require('./BetFair/stream-api.js');

const vendor = new BetFairSession(process.env.APP_KEY);
const betfair = new BetFairSession(process.env.APP_KEY);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Database = require('./Database/helper');
const SQLiteDatabase = require('./Database/SQLite/database');
const User = require('./Database/models/users');

if (process.env.NODE_ENV === 'production') {
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
}

app.get('/api/generate-client-token', (request, response) => {
  gateway.clientToken.generate({}, (err, res) => {
    response.json({
      clientToken: res.clientToken,
    });
  });
});

const runnerNames = {};

app.post('/api/save-runner-names', (request, response) => {
  runnerNames[request.body.marketId] = request.body.selectionNames;
  response.sendStatus(200);
});

app.get('/api/fetch-runner-names', (request, response) => {
  response.json(runnerNames[request.query.marketId]);
});

app.post('/api/checkout', (request, result) => {
  const nonceFromTheClient = request.body.payment_method_nonce;
  const { amount } = request.body;

  gateway.transaction.sale(
    {
      amount,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, res) => {
      Database.saveTransaction(betfair.email, { ...res.transaction, expiresIn: request.body.expiresIn });
      if (!err && res && res.status === 'submitted_for_settlement') {
        result.sendStatus(200);
      } else {
        result.sendStatus(400);
      }
    },
  );
});

app.get('/api/get-subscription-status', (req, res) => {
  betfair.isAccountSubscribedToWebApp(
    {
      vendorId: process.env.APP_ID,
    },
    async (err, { result }) => {
      res.json({
        isSubscribed: result,
        accessToken: await Database.getToken(betfair.email),
      });
    },
  );
});

app.get('/api/request-access-token', async (request, response) => {
  const params = {
    client_id: process.env.APP_ID,
    grant_type: request.query.tokenType,
    client_secret: process.env.APP_SECRET,
  };

  const token = async () => {
    vendor.login(process.env.BETFAIR_USER, process.env.BETFAIR_PASS).then((res) => {
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
            Database.setToken(betfair.email, tokenInfo).then(() => {
              response.json(tokenInfo);
            });
          }
        });
      }
    });
  };

  switch (request.query.tokenType) {
    case 'REFRESH_TOKEN':
      var storedTokenData = await Database.getTokenData(betfair.email);
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

app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  betfair
    .login(user, password)
    .then(({ sessionKey }) => {
      // Check if user exists, if doesn't exist, then create a new user
      Database.setUser(user, sessionKey);
      res.json({ sessionKey });
    })
    .catch((error) => res.json({ error }));
});

app.get('/api/logout', (req, res) => {
  betfair
    .logout()
    .then((res) => res.json(res))
    .catch((err) => res.json({ error: err }));
});

app.get('/api/get-account-balance', (request, response) => {
  betfair.getAccountFunds({ filter: {} }, (err, res) => {
    if (res.error) response.status(400).json(res);
    else {
      response.json({
        balance: res.result.availableToBetBalance,
      });
    }
  });
});

app.get('/api/get-account-details', (request, response) => {
  betfair.getAccountDetails({ filter: {} }, (err, res) => {
    if (res.error) response.status(400).json(res);
    else {
      response.json({
        name: res.result.firstName,
        countryCode: res.result.countryCode,
        currencyCode: res.result.currencyCode,
        localeCode: res.result.localeCode,
      });
    }
  });
});

app.get('/api/get-events-with-active-bets', (request, response) => {
  betfair.listCurrentOrders({ filter: {} }, async (err, res) => {
    if (!res.result) return response.json([]);

    const filteredOrders = _.uniq(res.result.currentOrders.map((order) => order.marketId));

    if (filteredOrders <= 0) return response.json([]);

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
  });
});

app.get('/api/premium-status', (request, response) => {
  Database.getPremiumStatus(betfair.email).then((expiryDate) => {
    response.json(expiryDate);
  });
});

app.get('/api/get-user-settings', (request, response) => {
  if (betfair.email === null) {
    response.sendStatus(400);
  }
  Database.getSettings(betfair.email).then((settings) => {
    response.json(settings);
  });
});

app.post('/api/save-user-settings', (request, response) => {
  Database.updateSettings(betfair.email, request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.get('/api/get-all-bets', (request, response) => {
  SQLiteDatabase.getBets().then((res) => {
    response.json(res);
  });
});

app.post('/api/save-bet', (request, response) => {
  SQLiteDatabase.addBet(request.body).then(() => {
    response.sendStatus(200);
  });
});

app.post('/api/update-order', (request, response) => {
  Database.updateOrder(betfair.email, request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/remove-orders', (request, response) => {
  Database.removeOrders(betfair.email, request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.get('/api/fetch-all-sports', async (request, response) => {
  betfair.allSports = {};
  const headers = {
    'X-Application': process.env.APP_KEY,
    'X-Authentication': betfair.sessionKey,
  };
  fetch('https://api.betfair.com/exchange/betting/rest/v1/en/navigation/menu.json', { headers })
    .then((res) => res.json())
    .then((res) => {
      res.children.forEach((item) => {
        betfair.allSports[item.id] = item.children;
      });
      response.sendStatus(200);
    })
    .catch(() => {
      response.sendStatus(400);
    });
});

app.get('/api/fetch-sport-data', (request, response) => (betfair.allSports[request.query.id] ? response.json(betfair.allSports[request.query.id]) : response.sendStatus(400).send('All Sports contains no data')));

app.get('/api/get-all-sports', (request, response) => {
  betfair.listEventTypes({ filter: {} }, (err, res) => {
    if (res.error) response.sendStatus(400).json();
    else response.json(res.result);
  });
});

app.get(
  '/api/get-my-markets',
  (request, response) =>
    new Promise((res, rej) => {
      User.findOne({ email: betfair.email })
        .then((doc) => response.json(doc.markets))
        .catch((err) => response.sendStatus(400));
    }),
);

app.post('/api/save-market', (request, response) => {
  Database.saveMarket(betfair.email, request.body).then((res) => {
    response.json(res);
  });
});

app.post('/api/remove-market', (request, response) => {
  Database.removeMarket(betfair.email, request.body).then((res) => {
    response.json(res);
  });
});

app.get('/api/list-todays-card', (request, response) => {
  betfair.listMarketCatalogue(
    {
      filter: {
        eventTypeIds: [request.query.id],
        marketTypeCodes: request.query.marketTypes !== 'undefined' ? [request.query.marketTypes] : undefined,
        marketCountries: request.query.country !== 'undefined' ? JSON.parse(request.query.country) : undefined,
        marketStartTime: {
          from: new Date(new Date().setSeconds(new Date().getSeconds() - 3600)).toJSON(),
          to: new Date(new Date().setSeconds(new Date().getSeconds() + 86400)).toJSON(),
        },
      },
      sort: 'FIRST_TO_START',
      maxResults: '1000',
      marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME'],
    },
    (err, res) => {
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
        return Object.assign(item, {
          marketName: `${marketStartDate} ${item.event.venue} ${item.marketName}`,
        });
      });

      const sortByTime = (a, b) => Date.parse(a.marketStartTime) - Date.parse(b.marketStartTime);

      const sortedResponse = mappedResponseNames.sort(sortByTime);

      const mappedResponse = sortedResponse.map((item) => ({
        id: item.marketId,
        name: item.marketName,
        type: 'MARKET',
      }));

      response.json(mappedResponse);
    },
  );
});

app.get('/api/list-countries', (request, response) => {
  betfair.listCountries(
    {
      filter: {
        eventTypeIds: [request.query.sportId],
      },
    },
    (err, res) => {
      response.json(res.result);
    },
  );
});

app.get('/api/list-competitions', (request, response) => {
  betfair.listCompetitions(
    {
      filter: {
        eventTypeIds: [request.query.sportId],
        marketCountries: [request.query.country],
      },
    },
    (err, res) => {
      response.json(res.result);
    },
  );
});

app.get('/api/list-events', (request, response) => {
  betfair.listEvents(
    {
      filter: {
        eventTypeIds: [request.query.sportId],
        marketCountries: [request.query.country],
      },
    },
    (err, res) => {
      response.json(res.result);
    },
  );
});

app.get('/api/list-competition-events', (request, response) => {
  betfair.listEvents(
    {
      filter: {
        competitionIds: [request.query.competitionId],
        marketCountries: [request.query.country],
      },
    },
    (err, res) => {
      response.json(res.result);
    },
  );
});

app.get('/api/list-markets', (request, response) => {
  betfair.listMarketCatalogue(
    {
      filter: {
        eventIds: [request.query.eventId],
        marketTypeCodes: request.query.marketTypeCodes,
      },
      sort: 'MAXIMUM_TRADED',
      maxResults: 1000,
    },
    (err, res) => {
      response.json(res);
    },
  );
});

app.get('/api/list-market-pl', (request, response) => {
  betfair.listMarketProfitAndLoss(
    {
      marketIds: [request.query.marketId],
    },
    (err, res) => {
      response.json(res);
    },
  );
});

app.get('/api/get-market-info', (request, response) => {
  betfair.listMarketCatalogue(
    {
      filter: {
        marketIds: [request.query.marketId],
      },
      marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME', 'MARKET_DESCRIPTION', 'RUNNER_DESCRIPTION', 'RUNNER_METADATA'],
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
  betfair.placeOrders(
    {
      marketId: request.body.marketId,
      instructions: [
        {
          betId: request.body.betId,
          newPersistenceType: 'PERSIST',
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

app.post('/api/replace-orders', (request, response) => {
  betfair.replaceOrders(
    {
      marketId: request.body.marketId,
      instructions: [
        {
          betId: request.body.betId,
          newPrice: request.body.newPrice,
        },
      ],
      customerRef: request.body.customerStrategyRef,
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

app.get('/api/listCurrentOrders', (request, response) => {
  betfair.listCurrentOrders(
    {
      marketIds: [request.query.marketId],
    },
    (err, res) => {
      response.json(res.result);
    },
  );
});

app.get('/api/list-order-to-duplicate', (request, response) => {
  betfair.listCurrentOrders(
    {
      marketIds: [request.query.marketId],
      OrderProjection: 'EXECUTABLE',
      SortDir: 'LATEST_TO_EARLIEST',
    },
    (err, res) => {
      response.json(res.result);
    },
  );
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

app.post('/paypal-transaction-complete', (request, response) => {
  Database.saveTransaction(betfair.email, request.body).then((res) => {
    response.sendStatus(res);
  });
});

// A call to get required params for O-auth (vendorId, vendorSecret)
app.get('/api/get-developer-application-keys', (request, response) => {
  betfair.getDeveloperAppKeys(
    {
      filter: {},
    },
    (err, res) => {
      const { vendorId } = res.result[1].appVersions[0];
      const { vendorSecret } = res.result[1].appVersions[0];
      response.json({
        vendorId,
        vendorSecret,
      });
    },
  );
});

process.stdin.resume(); // so the program will not close instantly

const exitHandler = (options, exitCode) => {
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
};

// App is closing
process.on(
  'exit',
  exitHandler.bind(null, {
    cleanup: true,
  }),
);

// Catches ctrl+c event
process.on(
  'SIGINT',
  exitHandler.bind(null, {
    exit: true,
  }),
);

// Catches "kill pid" (for example: nodemon restart)
process.on(
  'SIGUSR1',
  exitHandler.bind(null, {
    exit: true,
  }),
);
process.on(
  'SIGUSR2',
  exitHandler.bind(null, {
    exit: true,
  }),
);

// Catches uncaught exceptions
process.on(
  'uncaughtException',
  exitHandler.bind(null, {
    exit: true,
  }),
);

const port = process.env.PORT || 3001;

server.listen(port, () => console.log(`Server started on port: ${port}`));

let id = 1;
io.on('connection', async (client) => {
  let exchangeStream = new ExchangeStream(client);

  // Subscribe to market
  client.on('market-subscription', async (data) => {
    console.log(data.marketId, betfair.sessionKey);
    const marketSubscription = `{"op":"marketSubscription","id":${id += 1},"marketFilter":{"marketIds":["${
      data.marketId
    }"]},"marketDataFilter":{"ladderLevels": 2, "fields": [ "EX_ALL_OFFERS", "EX_TRADED", "EX_TRADED_VOL", "EX_LTP", "EX_MARKET_DEF" ]}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, betfair.sessionKey);
  });
  client.on('market-resubscription', async (data) => {
    const marketSubscription = `{"op":"marketSubscription","id":${id += 1},"initialClk":${data.initialClk},"clk":${data.clk},marketFilter":{"marketIds":["${
      data.marketId
    }"]},"marketDataFilter":{"ladderLevels": 2, "fields": [ "EX_ALL_OFFERS", "EX_TRADED", "EX_TRADED_VOL", "EX_LTP", "EX_MARKET_DEF" ]}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, betfair.sessionKey);
  });
  // Subscribe to orders
  client.on('order-subscription', async (data) => {
    const orderSubscription = `{"op":"orderSubscription","orderFilter":{"includeOverallPosition":false, "customerStrategyRefs":${data.customerStrategyRefs}},"segmentationEnabled":true}\r\n`;
    exchangeStream.makeSubscription(orderSubscription, betfair.sessionKey);
  });
  client.on('disconnect', async () => {
    const marketSubscription = `{"op":"marketSubscription","id":${id += 1},"marketFilter":{"marketIds":[""]},"marketDataFilter":{"ladderLevels": 2}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, betfair.sessionKey);
    exchangeStream.client.destroy();
    exchangeStream = null;
  });
});
