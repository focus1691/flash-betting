/* eslint-disable class-methods-use-this */
const express = require('express');
const path = require('path');
const http = require('http');
const SocketIO = require('socket.io');
const SseStream = require('ssestream').default;

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

    if (process.env.NODE_ENV === 'production') {
      const bundlePath = path.join(__dirname, '../build/index.html');
      this.app.get('/', (req, res) => res.sendFile(bundlePath));
      this.app.get('/dashboard', (req, res) => res.sendFile(bundlePath));
      this.app.get('/authentication', (req, res) => res.sendFile(bundlePath));
      this.app.get('/validation', (req, res) => res.sendFile(bundlePath));
      this.app.get('/logout', (req, res) => res.sendFile(bundlePath));

      this.app.get('/sse', (req, res) => {
      
        this.sseStream = new SseStream(req);
        this.sseStream.pipe(res);
      
        res.on('close', () => {
          this.sseStream.unpipe(res);
        })
      })
    }

    this.applyMiddlewares(middleWares);
    this.applyAuthMiddleware();

    this.initRoutes(controllers);

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

      // if (!req.cookies.token && !isAuthURL(req.url)) {
      //   console.log(5);
      //   return res.status(401).json({
      //     error: 'NO_SESSION',
      //   });
      // }
    
      // if (!betfair.accessToken && req.cookies.accessToken) {
      //   console.log(6);
      //   betfair.setAccessToken(req.cookies.accessToken);
      // }
    
      // if (!req.cookies.accessToken && !isAuthURL(req.url)) {
      //   console.log(7);
      //   const accessToken = await apiHelper.getAccessToken(req.cookies.token);
      //   if (accessToken) {
      //     res.cookie('accessToken', accessToken);
      //     betfair.setAccessToken(accessToken);
      //   } else {
      //     return res.status(401).json({
      //       error: 'NO_SESSION',
      //     });
      //   }
      // }
      req.betfair = betfair;
      req.apiHelper = apiHelper;
      req.sseStream = this.sseStream;
      return next();
    }).bind(this);
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
    
    const exchangeStream = betfair.createExchangeStream(client, betfair.sessionKey);

    client.on('market-subscription', async ({ marketId }) => {
      console.log(`Subscribing to market ${marketId}, Session: ${betfair.sessionKey}`);
      exchangeStream.makeMarketSubscription(betfair.sessionKey, marketId);
    });

    client.on('market-resubscription', async ({ initialClk, clk, marketId }) => {
      console.log(`Resubscribing to market ${marketId}, Session: ${betfair.sessionKey}`);
      exchangeStream.makeMarketSubscription(betfair.sessionKey, marketId, initialClk, clk);
    });

    client.on('disconnect', () => {
      exchangeStream.unsubscribe();
      console.log('socket disconnected', client.id);
    });
  }
};

module.exports = App;
