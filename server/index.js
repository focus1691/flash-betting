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

const cookieParser = require('cookie-parser');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path');

const fetch = require('node-fetch');

// The BetFair session class below contains all the methods
// to call the BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require('./BetFair/session.js');
const ExchangeStream = require('./BetFair/stream-api.js');

const vendor = new BetFairSession(process.env.APP_KEY);
const betfair = new BetFairSession(process.env.APP_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', (req, res, next) => {
  if (!betfair.sessionKey && req.cookies.sessionKey) {
    betfair.setSession(req.cookies.sessionKey)
  }
  next();
});

const Database = require('./Database/helper');
const SQLiteDatabase = require('./Database/SQLite/database');

const User = require('./Database/models/users');

SQLiteDatabase.setup();

if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../');
  const bundlePath = `${publicPath}build/index.html`;

  app.use(express.static(path.join(publicPath, 'build')));

  app.get('/', (req, res) => res.sendFile(bundlePath));
  app.get('/dashboard', (req, res) => res.sendFile(bundlePath));
  app.get('/getClosedMarketStats', (req, res) => res.sendFile(bundlePath));
  app.get('/authentication', (req, res) => res.sendFile(bundlePath));
  app.get('/validation', (req, res) => res.sendFile(bundlePath));
  app.get('/logout', (req, res) => res.sendFile(bundlePath));
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

app.get('/api/get-subscription-status', async (req, res) => {
  const { vendorId } = await new Promise((resolve, reject) => {
    betfair.getDeveloperAppKeys({ filter: {} }, (err, res) => {
      const app = res.result.find(({ appName }) => appName === 'Flash Betting');
      if (res) resolve(app.appVersions[0]);
    });
  });

  vendor.isAccountSubscribedToWebApp({ vendorId }, async (err, { result }) => {
    const accessToken = await Database.getToken(betfair.email);
    res.json({
      isSubscribed: result,
      accessToken,
      vendorId,
    });
  });
});

app.get('/api/request-access-token', async (request, response) => {
  const { tokenType } = request.query;

  const { vendorId, vendorSecret } = await new Promise((resolve, reject) => {
    vendor.getDeveloperAppKeys({ filter: {} }, (err, res) => {
      const app = res.result.find(({ appName }) => appName === 'Flash Betting');
      if (res) resolve(app.appVersions[0]);
    });
  });

  const params = {
    client_id: vendorId,
    grant_type: tokenType,
    client_secret: vendorSecret,
  };

  const token = async () => {
    vendor.login(process.env.BETFAIR_USER, process.env.BETFAIR_PASS).then((res) => {
      if (res.error) {
        return response.status(400).json(res);
      }
      vendor.token(params, async (err, res) => {
        if (res.error) {
          return response.status(400).json(res);
        }
        const tokenInfo = {
          accessToken: res.result.access_token,
          expiresIn: new Date(new Date().setSeconds(new Date().getSeconds() + res.result.expires_in)),
          refreshToken: res.result.refresh_token,
        };
        // Update the user details with the token information
        await Database.setToken(betfair.email, tokenInfo);
        return response.json(tokenInfo);
      });
    });
  };

  if (tokenType === 'REFRESH_TOKEN') {
    const storedTokenData = await Database.getTokenData(betfair.email);
    if (storedTokenData.expiresIn < new Date()) {
      params.refresh_token = storedTokenData.refreshToken;
      token();
    } else return response.json(storedTokenData);
  } else if (tokenType === 'AUTHORIZATION_CODE') {
    params.code = request.query.code;
    token();
  }
});

app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  betfair
    .login(user, password)
    .then(async (result) => {
      res.cookie('sessionKey', result.sessionKey);
      // Check if user exists, if doesn't exist, then create a new user
      Database.setUser(user);
      const accessToken = await Database.getToken(betfair.email);
      betfair.setAccessToken(accessToken);
      res.json(result);
    })
    .catch((error) => res.json({ error }));
});

app.get('/api/keep-alive', (req, res) => {
  betfair
    .keepAlive()
    .then(async (result) => {
      res.json(result);
    })
    .catch((error) => res.json({ error }));
});

app.get('/api/logout', (req, res) => {
  betfair
    .logout()
    .then((res) => {
      res.clearCookie('sessionKey');
      res.json(res);
    })
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
  if (!betfair.email) return response.json({ error: 'Not logged in' });
  Database.getPremiumStatus(betfair.email).then((expiryDate) => {
    response.json({ expiryDate });
  });
});

app.get('/api/get-all-bets', (request, response) => {
  SQLiteDatabase.getBets(request.query.marketId).then((res) => {
    response.json(res);
  });
});

app.post('/api/save-bet', (request, response) => {
  SQLiteDatabase.addBet(request.body).then(() => {
    response.sendStatus(200);
  });
});

app.post('/api/update-price', (request, response) => {
  SQLiteDatabase.updatePrice(request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/update-stop-loss', (request, response) => {
  SQLiteDatabase.updateStopLoss(request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/update-ticks', (request, response) => {
  SQLiteDatabase.updateTicks(request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/update-bet-matched', (request, response) => {
  SQLiteDatabase.updateOrderMatched(request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/remove-bet', (request, response) => {
  SQLiteDatabase.removeBet(request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.post('/api/remove-all-bets', (request, response) => {
  SQLiteDatabase.removeAllBets(request.body).then((res) => {
    response.sendStatus(res);
  });
});

app.get('/api/fetch-all-sports', async (request, response) => {
  betfair.allSports = {};
  const headers = {
    'X-Application': process.env.APP_KEY,
    'X-Authentication': betfair.sessionKey,
    'Accept-Encoding': 'gzip, deflate',
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
      // customerRef: request.body.customerStrategyRef,
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
      // customerRef: request.body.customerRef,
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
app.get('/api/get-developer-application-keys', async (request, response) => {
  const { vendorId, vendorSecret } = await new Promise((resolve, reject) => {
    betfair.getDeveloperAppKeys({ filter: {} }, (err, res) => {
      const app = res.result.find((apps) => apps.appName === 'Flash Betting');
      if (res) resolve(app.appVersions[0]);
    });
  });
  return response.json({ vendorId, vendorSecret });
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

server.listen(port, () => console.log(`Server started on port: ${port}`));
let id = 1;

io.on('connection', async (client) => {
  let exchangeStream = new ExchangeStream(client);
  // Subscribe to market
  client.on('market-subscription', async ({ marketId }) => {
    const accessToken = await Database.getToken(betfair.email);
    const marketSubscription = `{"op":"marketSubscription","id":${(id += 1)},"marketFilter":{"marketIds":["${marketId}"]},"marketDataFilter":{"ladderLevels": 2, "fields": [ "EX_ALL_OFFERS", "EX_TRADED", "EX_TRADED_VOL", "EX_LTP", "EX_MARKET_DEF" ]}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, accessToken);
  });
  client.on('market-resubscription', async ({ marketId, initialClk, clk }) => {
    const accessToken = await Database.getToken(betfair.email);
    const marketSubscription = `{"op":"marketSubscription","id":${(id += 1)},"initialClk":${initialClk},"clk":${clk},marketFilter":{"marketIds":["${marketId}"]},"marketDataFilter":{"ladderLevels": 2, "fields": [ "EX_ALL_OFFERS", "EX_TRADED", "EX_TRADED_VOL", "EX_LTP", "EX_MARKET_DEF" ]}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, accessToken);
  });
  // Subscribe to orders
  client.on('order-subscription', async ({ customerStrategyRefs }) => {
    const accessToken = await Database.getToken(betfair.email);
    const orderSubscription = `{"op":"orderSubscription","orderFilter":{"includeOverallPosition":false, "customerStrategyRefs":${customerStrategyRefs}},"segmentationEnabled":true}\r\n`;
    exchangeStream.makeSubscription(orderSubscription, accessToken);
  });
  client.on('disconnect', async () => {
    const accessToken = await Database.getToken(betfair.email);
    const marketSubscription = `{"op":"marketSubscription","id":${(id += 1)},"marketFilter":{"marketIds":[""]},"marketDataFilter":{"ladderLevels": 2}}\r\n`;
    exchangeStream.makeSubscription(marketSubscription, accessToken);
    exchangeStream.client.destroy();
    exchangeStream = null;
  });
});
