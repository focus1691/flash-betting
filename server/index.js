// This adds environment-specific variables on new lines in the form of NAME=VALUE
// Access with process.env
require("dotenv").config();

// The BetFair session class below contains all the methods
// to call the BetFair API. Some samples are commented below to demonstrate their utility.
const BetFairSession = require("./BetFair/session.js");
const ExchangeStream = require("./BetFair/stream-api.js");

const session = new BetFairSession(process.env.APP_KEY);

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

const database = require("./Database/helper");
const PayPal = require("./PayPal");

// Load the session key from localStorage into the database and session object
app.get("/api/load-session", (request, response) => {

  session.setActiveSession(request.query.sessionKey);
  session.setEmailAddress(request.query.email);

  response.send("sent");
});

app.get("/api/get-subscription-status", (request, response) => {
  session.isAccountSubscribedToWebApp(
    {
      vendorId: "74333"
    },
    (err, res) => {
      response.json({
        val: res.result
      });
    }
  );
});

app.get("/api/login", (request, response) => {
  session
    .login(request.query.user, request.query.pass)
    .then(res => {
      response.json({
        sessionKey: res.sessionKey
      });
      // Check if user exists, if doesn't exist, then create a new user
      database.setUser(request.query.user, res.sessionKey);
    })
    .bind(this)
    .catch(err =>
      response.json({
        error: err
      })
    );
});

app.get("/api/logout", (request, response) => {
  session
    .logout()
    .then(res => {
      response.json(res);
    })
    .bind(this)
    .catch(err =>
      response.json({
        error: err
      })
    );
});

app.get("/api/get-account-balance", (request, response) => {
  session.getAccountFunds(
    {
      filter: {}
    },
    (err, res) => {
      response.json({
        balance: res.result.availableToBetBalance
      });
    }
  );
});

app.get("/api/get-account-details", (request, response) => {
  session.getAccountDetails(
    {
      filter: {}
    },
    (err, res) => {
      response.json({
        name: res.result.firstName,
        countryCode: res.result.countryCode,
        currencyCode: res.result.currencyCode,
        localeCode: res.result.localeCode
      });
    }
  );
});

app.get("/api/premium-status", (request, response) => {
  database.getPremiumStatus(session.email).then(premiumStatus => {
    response.json(premiumStatus);
  });
});


app.get("/api/get-user-settings", (request, response) => {
  database.getSettings(session.email).then(settings => {
    response.json(settings);
  });
});

app.post("/api/save-user-settings", (request, response) => {
  database.updateSettings(session.email, request.body).then(res => {
    response.sendStatus(res);
  });
});

app.get("/api/get-all-orders", (request, response) => {
  database.getAllOrders(session.email).then(res => {
    response.json(res);
  });
});

app.post("/api/save-order", (request, response) => {
  database.saveOrder(session.email, request.body).then(res => {
    response.sendStatus(res);
  });
});

app.post("/api/update-order", (request, response) => {
  database.updateOrderKey(session.email, request.body).then(res => {
    response.sendStatus(res);
  });
});

app.post("/api/remove-orders", (request, response) => {
  database.removeOrders(session.email, request.body).then(res => {
    response.sendStatus(res);
  });
});

app.get("/api/request-access-token", (request, response) => {
  // This call can be used for the refresh token
  // by changing the "grant type" to "REFRESH_TOKEN"
  session.token(
    {
      client_id: process.env.APP_ID,
      grant_type: "AUTHORIZATION_CODE",
      client_secret: process.env.APP_SECRET,
      code: request.query.code
    },
    (err, res) => {
      var tokenInfo = {
        accessToken: res.result.access_token,
        expiresIn: res.result.expires_in,
        refreshToken: res.result.refresh_token
      };
      // Update the user details with the token information
      database.setToken(session.email, tokenInfo).then(status => {
        response.json(tokenInfo);
      });
    }
  );
});

app.get("/api/get-all-sports", (request, response) => {
  session.listEventTypes(
    {
      filter: {}
    },
    (err, res) => {
      response.json(res.result);
    }
  );
});

app.get("/api/list-countries", (request, response) => {
  session.listCountries(
    {
      filter: {
        eventTypeIds: [request.query.sportId]
      }
    },
    (err, res) => {
      response.json(res.result);
    }
  );
});

app.get("/api/list-competitions", (request, response) => {
  session.listCompetitions(
    {
      filter: {
        eventTypeIds: [request.query.sportId],
        marketCountries: [request.query.country]
      }
    },
    (err, res) => {
      response.json(res.result);
    }
  );
});

app.get("/api/list-events", (request, response) => {
  session.listEvents(
    {
      filter: {
        eventTypeIds: [request.query.sportId],
        marketCountries: [request.query.country]
      }
    },
    (err, res) => {
      response.json(res.result);
    }
  );
});

app.get("/api/list-competition-events", (request, response) => {
  session.listEvents(
    {
      filter: {
        competitionIds: [request.query.competitionId],
        marketCountries: [request.query.country]
      }
    },
    (err, res) => {
      response.json(res.result);
    }
  );
});

app.get("/api/list-markets", (request, response) => {
  const filter = {
    eventIds: [request.query.eventId]
  };
  switch (request.query.eventId) {
    case 1:
      filter.marketTypeCodes = ["MATCH_ODDS"];
    case 7:
      filter.marketTypeCodes = ["WIN"];
  }

  session.listMarketCatalogue(
    {
      filter,
      sort: "MAXIMUM_TRADED",
      maxResults: 1000
    },
    (err, res) => {
      response.json(res);
    }
  );
});

app.get("/api/get-market-info", (request, response) => {
  session.listMarketCatalogue(
    {
      filter: {
        marketIds: [request.query.marketId]
      },
      marketProjection: [
        "COMPETITION",
        "EVENT",
        "EVENT_TYPE",
        "MARKET_START_TIME",
        "MARKET_DESCRIPTION",
        "RUNNER_DESCRIPTION",
        "RUNNER_METADATA"
      ],
      maxResults: 1
    },
    (err, res) => {
      response.json(res);
    }
  );
});

app.post("/api/place-order", (request, response) => {
  console.log(request.body);
  session.placeOrders(
    {
      marketId: request.body.marketId,
      instructions: [
        {
          selectionId: request.body.selectionId,
          handicap: "0",
          side: request.body.side,
          orderType: "LIMIT",
          limitOrder: {
            size: request.body.size,
            price: request.body.price,
            persistenceType: "PERSIST",

          }
        }
      ],
      customerStrategyRef: request.body.customerStrategyRef
    },
    (err, res) => {
      // console.log(res);
      response.json(res.result);
    }
  );
});

app.post("/api/cancel-order", (request, response) => {
  console.log(request.body);
  session.cancelOrders(
    {
      marketId: request.body.marketId,
      instructions: [
        {
          betId: request.body.betId,
          sizeReduction: request.body.sizeReduction
        }
      ],
      customerRef: request.body.customerRef
    },
    (err, res) => {
      // console.log(res);
      response.json(res.result);
    }
  );
});

// A call to get required params for O-auth (vendorId, vendorSecret)
app.get("/api/get-developer-application-keys", (request, response) => {
  session.getDeveloperAppKeys(
    {
      filter: {}
    },
    (err, res) => {
      var vendorId = res.result[1].appVersions[0].vendorId;
      var vendorSecret = res.result[1].appVersions[0].vendorSecret;
      response.json({
        vendorId,
        vendorSecret
      });
    }
  );
});

const port = 3001;
app.listen(port, () => console.log(`Server started on port: ${port}`));

process.stdin.resume(); //so the program will not close instantly

const exitHandler = (options, exitCode) => {
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
};

// App is closing
process.on(
  "exit",
  exitHandler.bind(null, {
    cleanup: true
  })
);

// Catches ctrl+c event
process.on(
  "SIGINT",
  exitHandler.bind(null, {
    exit: true
  })
);

// Catches "kill pid" (for example: nodemon restart)
process.on(
  "SIGUSR1",
  exitHandler.bind(null, {
    exit: true
  })
);
process.on(
  "SIGUSR2",
  exitHandler.bind(null, {
    exit: true
  })
);

// Catches uncaught exceptions
process.on(
  "uncaughtException",
  exitHandler.bind(null, {
    exit: true
  })
);

const io = require("socket.io")(8000);
io.on("connection", client => {
  client.on("market-subscription", data => {
    database.getToken(session.email).then(accessToken => {
      const exchangeStream = new ExchangeStream(accessToken);
      exchangeStream.authenticate(data, client);
    });
  });
});
