//* Dependencies
require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const path = require('path');
const fetch = require('node-fetch');

//* Server setup
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Server started on port: ${port}`));
const io = require('socket.io')(server);

//* BetFair setup
const BetFairSession = require('./betfair/session.js');
const APIHelper = require('./api/helper');

const betfair = new BetFairSession(process.env.APP_KEY);
const apiHelper = new APIHelper(betfair);

//* Database setup
const db = require('./sqlite/database');
//* Utility
const { isAuthURL } = require('./utils/Validator');

db.setup();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));

  const bundlePath = path.join(__dirname, 'build/index.html');
  app.get('/', (req, res) => res.sendFile(bundlePath));
  app.get('/dashboard', (req, res) => res.sendFile(bundlePath));
  app.get('/getClosedMarketStats', (req, res) => res.sendFile(bundlePath));
  app.get('/authentication', (req, res) => res.sendFile(bundlePath));
  app.get('/validation', (req, res) => res.sendFile(bundlePath));
  app.get('/logout', (req, res) => res.sendFile(bundlePath));
}

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
    const accessToken = await apiHelper.getAccessToken();
    if (accessToken) {
      res.cookie('accessToken', accessToken);
      betfair.setAccessToken(accessToken);
    } else {
      return res.status(401).json({
        error: 'NO_SESSION',
      });
    }
  }
  return next();
});

app.get('/api/get-subscription-status', (req, res) => {
  betfair.isAccountSubscribedToWebApp({ vendorId: process.env.VENDOR_ID }, async (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    const accessToken = await apiHelper.getAccessToken();
    return res.status(200).json({
      result: {
        isSubscribed: result,
        accessToken,
        vendorId: process.env.VENDOR_ID,
      },
    });
  });
});

app.get('/api/revoke-subscription-status', (req, res) => {
  betfair.revokeAccessToWebApp({ vendorId: process.env.VENDOR_ID }, async (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.status(200).json({ result });
  });
});

app.get('/api/get-vendor-client-id', async (req, res) => {
  betfair.getVendorClientId({}, async (err, { error, result }) => {
    if (error) {
      return res.status(401).json({
        error,
      });
    }
    return res.status(200).json({ result });
  });
});

app.post('/api/login', (req, res) => {
  const { user, password } = req.body;
  betfair
    .login(user, password)
    .then(async (result) => {
      res.cookie('sessionKey', result.sessionKey);
      res.cookie('username', user);
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
    .catch((error) => res.json({ error }));
});

app.get('/api/get-account-balance', (req, res) => {
  betfair.getAccountFunds({ filter: {} }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
});

app.get('/api/get-account-details', (req, res) => {
  betfair.getAccountDetails({ filter: {} }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
});

app.get('/api/get-events-with-active-bets', (req, res) => {
  betfair.listCurrentOrders({ filter: {} }, async (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }

    const filteredOrders = _.uniq(result.currentOrders.map((order) => order));

    if (filteredOrders.length <= 0) return res.json([]);

    return betfair.listMarketCatalogue({
      filter: {
        marketIds: filteredOrders
      },
      maxResults: 100,
      marketProjection: ['EVENT'],
    }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  });
});

//* SQLite
app.get('/api/get-all-bets', (req, res) => db.getBets(req.query.marketId).then((bets) => res.json(bets)));
app.post('/api/save-bet', (req, res) => db.addBet(req.body).then(() => res.json({ message: 'Bet saved' })));
app.post('/api/update-price', (req, res) => db.updatePrice(req.body).then(() => res.json({ message: 'Price updated' })));
app.post('/api/update-stop-loss', (req, res) => db.updateStopLoss(req.body).then(() => res.json({ message: 'Stop Loss updated' })));
app.post('/api/update-ticks', (req, res) => db.updateTicks(req.body).then(() => res.json({ message: 'Ticks updated' })));
app.post('/api/update-bet-matched', (req, res) =>
  db.updateOrderMatched(req.body).then(() =>
    res.json({
      message: 'Updated the bet to matched',
    }),
  ),
);
app.post('/api/remove-bet', (req, res) =>
  db.removeBet(req.body).then(() =>
    res.json({
      message: 'Removed bet',
    }),
  ),
);
app.post('/api/remove-all-bets', (req, res) =>
  db.removeAllBets(req.body).then(() =>
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
  const { marketId } = req.query;
  betfair.listMarketBook({ marketIds: marketId, priceProjection: { priceData: ['EX_TRADED', 'EX_ALL_OFFERS'] } }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
});

app.post('/api/place-order', (req, res) => {
  const { marketId, selectionId, side, size, price, customerStrategyRef } = req.body;
  betfair.placeOrders(
    {
      marketId,
      instructions: [
        {
          selectionId,
          side,
          orderType: 'LIMIT',
          limitOrder: {
            size,
            price,
          },
        },
      ],
      customerStrategyRef,
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
  const { marketId, betId, customerStrategyRef } = req.body;
  betfair.placeOrders(
    {
      marketId,
      instructions: [{ betId, newPersistenceType: 'PERSIST' }],
      customerStrategyRef,
    },
    (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    },
  );
});

app.post('/api/replace-orders', (req, res) => {
  const { marketId, betId, newPrice } = req.body;
  betfair.replaceOrders({ marketId, instructions: [{ betId, newPrice }] }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
});

app.get('/api/listCurrentOrders', (req, res) => {
  betfair.listCurrentOrders({ marketIds: [req.query.marketId] }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
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
        return res.status(401).json({ error });
      }
      return res.json({ result });
    },
  );
});

app.get('/api/list-cleared-orders', (req, res) => {
  betfair.listClearedOrders({ betStatus: 'SETTLED', fromRecord: 0, recordCount: 0, groupBy: 'MARKET' }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
});

app.get('/api/list-recent-orders', (req, res) => {
  betfair.listClearedOrders({ betStatus: 'SETTLED', recordCount: 10, groupBy: 'MARKET' }, (err, { error, result }) => {
    if (error) {
      return res.status(401).json({ error });
    }
    return res.json({ result });
  });
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

io.on('connection', async (client) => {
  const accessToken = betfair.accessToken || (await apiHelper.getAccessToken());

  betfair.createExchangeStream(client, accessToken);
  client.on('market-subscription', async ({ marketId }) => {
    betfair.exchangeStream.makeMarketSubscription(marketId);
  });
  client.on('market-resubscription', async ({ initialClk, clk, marketId }) => {
    betfair.exchangeStream.makeMarketResubscription(initialClk, clk, marketId);
  });
  client.on('order-subscription', async ({ customerStrategyRefs }) => {
    betfair.exchangeStream.makeOrderSubscription(customerStrategyRefs);
  });
  client.on('disconnect', () => {
    betfair.exchangeStream.unsubscribe();
  });
});
