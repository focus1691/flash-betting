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

const vendor = new BetFairSession(process.env.APP_KEY);
const betfair = new BetFairSession(process.env.APP_KEY);

const Database = require('./Database/helper');
const SQLiteDatabase = require('./Database/SQLite/database');

const User = require('./Database/models/users');

const { isAuthURL } = require('./utils/Validator');

SQLiteDatabase.setup();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/', async (req, res, next) => {
  if (!betfair.email && req.cookies.username) {
    betfair.setEmailAddress(req.cookies.username);
  }

  if (!req.cookies.username && !isAuthURL(req.url)) {
    return res.status(401).json({
      error: 'NO_SESSION',
    });
  }

  if (!betfair.sessionKey && req.cookies.sessionKey) {
    betfair.setSession(req.cookies.sessionKey);
  }

  if (!req.cookies.sessionKey && !isAuthURL(req.url)) {
    return res.status(401).json({
      error: 'NO_SESSION',
    });
  }

  if (!betfair.accessToken && req.cookies.accessToken) {
    betfair.setAccessToken(req.cookies.accessToken);
  }

  if (!req.cookies.accessToken && !isAuthURL(req.url)) {
    const accessToken = await Database.getToken(betfair.email);
    betfair.setAccessToken(accessToken);
    if (!accessToken) {
      return res.status(401).json({
        error: 'NO_SESSION',
      });
    }
  }
  next();
});

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
      Database.saveTransaction(betfair.email, {
        ...res.transaction,
        expiresIn: request.body.expiresIn,
      });
      if (!err && res && res.status === 'submitted_for_settlement') {
        result.sendStatus(200);
      } else {
        result.sendStatus(400);
      }
    },
  );
});

app.post('/paypal-transaction-complete', (request, response) =>
  Database.saveTransaction(betfair.email, request.body).then(() =>
    response.json({
      message: 'Payment accepted',
    }),
  ),
);

app.get('/api/get-subscription-status', (req, res) => {
  betfair.getDeveloperAppKeys({
    filter: {},
  },
    async (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      const app = result.find(({ appName }) => appName === 'Flash Betting');
      if (app) {
        const { vendorId } = app.appVersions[0];

        vendor.isAccountSubscribedToWebApp({ vendorId },
          async (err, { result }) => {
            if (error) {
              return res.status(401).json({ error });
            }
            const accessToken = await Database.getToken(betfair.email);
            return res.json({
              result: {
                isSubscribed: result,
                accessToken,
                vendorId,
              }
            });
          },
        );
      }
    },
  );
});

app.get('/api/request-access-token', async (req, res) => {
  const { tokenType } = req.query;

  const { vendorId, vendorSecret, error } = await new Promise((resolve, reject) => {
    vendor.getDeveloperAppKeys(
      {
        filter: {},
      },
      (err, { error, result }) => {
        if (error) {
          resolve({ error });

        }
        const app = result.find(({ appName }) => appName === 'Flash Betting');
        if (app) resolve(app.appVersions[0]);
      },
    );
  });

  if (error) {
    return res.status(401).json({ error });
  }

  const params = {
    client_id: vendorId,
    grant_type: tokenType,
    client_secret: vendorSecret,
  };

  const token = async () => {
    vendor.login(process.env.BETFAIR_USER, process.env.BETFAIR_PASS).then(({ error }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      vendor.token(params, async (err, { error, result }) => {
        if (error) {
          return res.status(401).json({ error });
        }
        const tokenInfo = {
          accessToken: result.access_token,
          expiresIn: new Date(new Date().setSeconds(new Date().getSeconds() + result.expires_in)),
          refreshToken: result.refresh_token,
        };
        // Update the user details with the token information
        res.cookie('accessToken', tokenInfo.accessToken);
        betfair.setAccessToken(tokenInfo.accessToken);
        await Database.setToken(betfair.email, tokenInfo);
        return res.json({ result: tokenInfo });
      });
    });
  };

  if (tokenType === 'REFRESH_TOKEN') {
    const storedTokenData = await Database.getTokenData(betfair.email);
    if (storedTokenData.expiresIn < new Date()) {
      params.refresh_token = storedTokenData.refreshToken;
      token();
    } else {
      return res.json({ result: storedTokenData });
    }
  } else if (tokenType === 'AUTHORIZATION_CODE') {
    params.code = req.query.code;
    token();
  }
});

app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  betfair
    .login(user, password)
    .then(async (result) => {
      res.cookie('sessionKey', result.sessionKey);
      res.cookie('username', user);
      Database.setUser(user); // If user not found, create a new user
      res.json(result);
    })
    .catch((error) =>
      res.json({
        error,
      }),
    );
});

app.get('/api/keep-alive', (req, res) => {
  betfair
    .keepAlive()
    .then(async (result) => {
      res.json(result);
    })
    .catch((error) =>
      res.json({
        error,
      }),
    );
});

app.get('/api/logout', (req, res) => {
  betfair
    .logout()
    .then((res) => {
      res.clearCookie('sessionKey');
      res.clearCookie('accessToken');
      res.clearCookie('username');
      res.json(res);
    })
    .catch((err) =>
      res.json({
        error: err,
      }),
    );
});

app.get('/api/get-account-balance', (req, res) => {
  betfair.getAccountFunds(
    {
      filter: {},
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/get-account-details', (req, res) => {
  betfair.getAccountDetails(
    {
      filter: {},
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/get-events-with-active-bets', (req, res) => {
  betfair.listCurrentOrders(
    {
      filter: {},
    },
    async (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }

      const filteredOrders = _.uniq(result.currentOrders.map((order) => order));

      if (filteredOrders.length <= 0) return res.json([]);

      return betfair.listMarketCatalogue(
        {
          filter: {
            marketIds: filteredOrders,
          },
          maxResults: 100,
        },
        (err, { error, result }) => {
          if (error) {
            return res.status(401).json({
              error,
            });
          }
          return res.json({ result });
        },
      );
    },
  );
});

//* Premium Status
app.get('/api/premium-status', async (req, res) =>
  Database.getPremiumStatus(betfair.email).then((expiryDate) =>
    res.json({
      result: expiryDate,
    }),
  ),
);

//* SQLite
app.get('/api/get-all-bets', (req, res) => SQLiteDatabase.getBets(req.query.marketId).then((bets) => res.json(bets)));
app.post('/api/save-bet', (req, res) =>
  SQLiteDatabase.addBet(req.body).then(() =>
    res.json({
      message: 'Bet saved',
    }),
  ),
);
app.post('/api/update-price', (req, res) =>
  SQLiteDatabase.updatePrice(req.body).then(() =>
    res.json({
      message: 'Price updated',
    }),
  ),
);
app.post('/api/update-stop-loss', (req, res) =>
  SQLiteDatabase.updateStopLoss(req.body).then(() =>
    res.json({
      message: 'Stop Loss updated',
    }),
  ),
);
app.post('/api/update-ticks', (req, res) =>
  SQLiteDatabase.updateTicks(req.body).then(() =>
    res.json({
      message: 'Ticks updated',
    }),
  ),
);
app.post('/api/update-bet-matched', (req, res) =>
  SQLiteDatabase.updateOrderMatched(req.body).then(() =>
    res.json({
      message: 'Updated the bet to matched',
    }),
  ),
);
app.post('/api/remove-bet', (req, res) =>
  SQLiteDatabase.removeBet(req.body).then(() =>
    res.json({
      message: 'Removed bet',
    }),
  ),
);
app.post('/api/remove-all-bets', (req, res) =>
  SQLiteDatabase.removeAllBets(req.body).then(() =>
    res.json({
      message: 'Removed all bets',
    }),
  ),
);

app.get('/api/fetch-all-sports', async (request, response) => {
  betfair.allSports = {};
  const headers = {
    'X-Application': process.env.APP_KEY,
    'X-Authentication': betfair.sessionKey,
    'Accept-Encoding': 'gzip, deflate',
  };
  fetch('https://api.betfair.com/exchange/betting/rest/v1/en/navigation/menu.json', {
    headers,
  })
    .then((res) => res.json())
    .then((res) => {
      res.children.forEach((item) => {
        betfair.allSports[item.id] = item.children;
      });
      response.status(200).json({ sports: betfair.allSports });
    })
    .catch(() => {
      response.sendStatus(400);
    });
});

app.get('/api/fetch-sport-data', (req, res) => {
  if (betfair.allSports[req.query.id]) {
    return res.json({ result: betfair.allSports[req.query.id] });
  }
  return res.status(400).json({ error: 'All Sports contains no data' });
});

app.get('/api/get-all-sports', (req, res) => {
  betfair.listEventTypes(
    {
      filter: {},
    },
    (err, { error, result }) => {
      if (error) {
        return res.sendStatus(400).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

//! Testing Only 
app.get('/api/get-event', (req, res) => {
  betfair.listEventTypes(
    {
      filter: {
        competitionIds: ['1575693754'],
      },
    },
    (err, { error, result }) => {
      if (error) {
        return res.sendStatus(400).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/get-my-markets', (req, res) =>
  User.findOne({
    email: betfair.email,
  })
    .then((doc) => res.json(doc.markets))
    .catch(() => res.status.json({ error: 'cannot get markets' }))
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

app.get('/api/list-todays-card', (req, res) => {
  betfair.listMarketCatalogue(
    {
      filter: {
        eventTypeIds: [req.query.id],
        marketTypeCodes: req.query.marketTypes !== 'undefined' ? [req.query.marketTypes] : undefined,
        marketCountries: req.query.country !== 'undefined' ? JSON.parse(req.query.country) : undefined,
        marketStartTime: {
          from: new Date(new Date().setSeconds(new Date().getSeconds() - 3600)).toJSON(),
          to: new Date(new Date().setSeconds(new Date().getSeconds() + 86400)).toJSON(),
        },
      },
      sort: 'FIRST_TO_START',
      maxResults: '1000',
      marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME'],
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }

      // if its the next day, we have to put the date
      const mappedResponseNames = result.map((item) => {
        const marketStartTime = new Date(item.marketStartTime);
        const currentDay = new Date(Date.now()).getDay();
        const marketStartDay = marketStartTime.getDay();
        const marketStartOnDiffDay = marketStartDay > currentDay || marketStartDay < currentDay;

        const dateSettings = {
          hour12: false,
        };
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

      res.json({ result: mappedResponse });
    },
  );
});

app.get('/api/list-market-pl', (req, res) => {
  betfair.listMarketProfitAndLoss(
    {
      marketIds: [req.query.marketId],
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/get-market-info', (req, res) => {
  betfair.listMarketCatalogue(
    {
      filter: {
        marketIds: [req.query.marketId],
      },
      marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME', 'MARKET_DESCRIPTION', 'RUNNER_DESCRIPTION', 'RUNNER_METADATA'],
      maxResults: 1,
    },
    (err, { result, error }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/list-market-book', (req, res) => {
  betfair.listMarketBook(
    {
      marketIds: [req.query.marketId],
      priceProjection: {
        priceData: ['EX_TRADED', 'EX_ALL_OFFERS'],
      },
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.post('/api/place-order', (req, res) => {
  betfair.placeOrders(
    {
      marketId: req.body.marketId,
      instructions: [
        {
          selectionId: req.body.selectionId,
          side: req.body.side,
          orderType: 'LIMIT',
          limitOrder: {
            size: req.body.size,
            price: req.body.price,
          },
        },
      ],
      customerStrategyRef: req.body.customerStrategyRef,
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.post('/api/cancel-order', (req, res) => {
  betfair.cancelOrders(
    {
      marketId: req.body.marketId,
      instructions: [
        {
          betId: req.body.betId,
          sizeReduction: req.body.sizeReduction,
        },
      ],
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.post('/api/update-orders', (req, res) => {
  betfair.placeOrders(
    {
      marketId: req.body.marketId,
      instructions: [
        {
          betId: req.body.betId,
          newPersistenceType: 'PERSIST',
        },
      ],
      customerStrategyRef: req.body.customerStrategyRef,
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.post('/api/replace-orders', (req, res) => {
  betfair.replaceOrders(
    {
      marketId: req.body.marketId,
      instructions: [
        {
          betId: req.body.betId,
          newPrice: req.body.newPrice,
        },
      ],
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/listCurrentOrders', (req, res) => {
  betfair.listCurrentOrders(
    {
      marketIds: [req.query.marketId],
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/list-order-to-duplicate', (req, res) => {
  betfair.listCurrentOrders(
    {
      marketIds: [req.query.marketId],
      OrderProjection: 'EXECUTABLE',
      SortDir: 'LATEST_TO_EARLIEST',
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/list-cleared-orders', (req, res) => {
  betfair.listClearedOrders(
    {
      betStatus: 'SETTLED',
      fromRecord: 0,
      recordCount: 0,
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/list-recent-orders', (req, res) => {
  betfair.listClearedOrders(
    {
      betStatus: 'SETTLED',
      recordCount: 8,
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.json({ result });
    },
  );
});


// A call to get required params for O-auth (vendorId, vendorSecret)
app.get('/api/get-developer-application-keys', async (request, response) => {
  const { vendorId, vendorSecret } = await new Promise((resolve, reject) => {
    betfair.getDeveloperAppKeys(
      {
        filter: {},
      },
      (err, res) => {
        const app = res.result.find((apps) => apps.appName === 'Flash Betting');
        if (res) resolve(app.appVersions[0]);
      },
    );
  });
  return response.json({
    vendorId,
    vendorSecret,
  });
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

io.on('connection', async (client) => {
  const accessToken = await Database.getToken(betfair.email);
  betfair.createExchangeStream(client, accessToken);
  client.on('market-subscription', ({ marketId }) => {
    betfair.exchangeStream.makeMarketSubscription(marketId);
  });
  client.on('market-resubscription', ({ initialClk, clk, marketId }) => {
    betfair.exchangeStream.makeMarketResubscription(initialClk, clk, marketId);
  });
  client.on('order-subscription', ({ customerStrategyRefs }) => {
    betfair.exchangeStream.makeOrderSubscription(customerStrategyRefs);
  });
  client.on('disconnect', () => {
    betfair.exchangeStream.unsubscribe();
  });
});
