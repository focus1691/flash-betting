/* eslint-disable class-methods-use-this */
const express = require('express');
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');

const BetFairSession = require('./betfair/session.js');
const APIHelper = require('./api/helper');

const betfair = new BetFairSession(process.env.APP_KEY);
const apiHelper = new APIHelper(betfair);

const { isAuthURL } = require('./utils/Validator');

class App {
  constructor({ port, controllers, middleWares }) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);

    this.applyMiddlewares(middleWares);
    this.applyAuthMiddleware();

    this.initRoutes(controllers);

    if (process.env.NODE_ENV === 'production') {
      const bundlePath = path.join(__dirname, '../build/index.html');
      this.app.get('/', (req, res) => res.sendFile(bundlePath));
      this.app.get('/dashboard', (req, res) => res.sendFile(bundlePath));
      this.app.get('/authentication', (req, res) => res.sendFile(bundlePath));
      this.app.get('/validation', (req, res) => res.sendFile(bundlePath));
      this.app.get('/logout', (req, res) => res.sendFile(bundlePath));
    }

    this.io = SocketIO(this.server);
    this.io.on('connection', this.onClientConnected);

    return this;
  }

  applyMiddlewares(middleWares) {
    middleWares.forEach(middleware => {
      this.app.use(middleware);
    });
  }

  applyAuthMiddleware() {
    this.app.use('/', async (req, res, next) => {
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
        const accessToken = await apiHelper.getAccessToken(req.cookies.token);
        if (accessToken) {
          res.cookie('accessToken', accessToken);
          betfair.setAccessToken(accessToken);
        } else {
          return res.status(401).json({
            error: 'NO_SESSION',
          });
        }
      }
      req.betfair = betfair;
      req.apiHelper = apiHelper;
      return next();
    });
  }

  initRoutes(controllers) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }

  listen() {
    this.server.listen(this.port, () => console.log(`Server started on port: ${this.port}`));
  }

  async onClientConnected(client) {
    console.log('new socket connection', client.id);
    
    if (betfair.accessToken) {
      const exchangeStream = betfair.createExchangeStream(client, betfair.accessToken);

      client.on('market-subscription', async ({ marketId }) => {
        exchangeStream.makeMarketSubscription(marketId);
      });
  
      client.on('market-resubscription', async ({ initialClk, clk, marketId }) => {
        console.log(`resubscribing to market ${marketId}`);
        exchangeStream.makeMarketSubscription(marketId, initialClk, clk);
      });
  
      client.on('order-subscription', async ({ customerStrategyRefs }) => {
        exchangeStream.makeOrderSubscription(customerStrategyRefs);
      });
  
      client.on('disconnect', () => {
        exchangeStream.unsubscribe();
        console.log('socket disconnected', client.id);
      });
    }
  }
};

module.exports = App;
