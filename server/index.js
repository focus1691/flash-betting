require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const App = require('./app.js');

const BetFairAccountController = require('./controllers/betfair-account');
const BetFairAuthController = require('./controllers/betfair-auth');
const BetFairBettingControlling = require('./controllers/betfair-betting');
const BetFairMenuController = require('./controllers/betfair-menu');
const TradingToolsController = require('./controllers/trading-tools');

const app = new App({
  port: process.env.PORT || 3001,
  controllers: [
    new BetFairAccountController(),
    new BetFairAuthController(),
    new BetFairBettingControlling(),
    new BetFairMenuController(),
    new TradingToolsController(),
  ],
  middleWares: [
    express.json(),
    express.urlencoded({ extended: true }),
    cookieParser(),
    express.static(path.join(__dirname, '../build'))
  ],
}).listen();

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

module.exports = app;
