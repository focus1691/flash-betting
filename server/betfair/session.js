/* eslint-disable class-methods-use-this */
const _ = require('lodash');
const auth = require('./auth.js');
const BetfairInvocation = require('./invocation.js');
const ExchangeStream = require('./exchange-stream');

// ************************************************************************
// * Betting API - https://api.betfair.com:443/exchange/betting/json-rpc/v1/
// ************************************************************************
const API_BETTING_METHODS = [
  // read-only
  'listEventTypes',
  'listCompetitions',
  'listTimeRanges',
  'listEvents',
  'listMarketTypes',
  'listCountries',
  'listVenues',
  'listMarketCatalogue',
  'listMarketBook',
  'listMarketProfitAndLoss',
  'listCurrentOrders',
  'listClearedOrders',
  // transactional
  'placeOrders',
  'cancelOrders',
  'replaceOrders',
  'updateOrders',
];

// ************************************************************************
// * Accounts API - https://api.betfair.com:443/exchange/account/json-rpc/v1/
// ************************************************************************
const API_ACCOUNT_METHODS = [
  'createDeveloperAppKeys',
  'getDeveloperAppKeys',
  'getAccountDetails',
  'getAccountFunds',
  'getVendorClientId',
  'getVendorDetails',
  'getAccountStatement',
  'listCurrencyRates',
  'transferFunds',
  'token',
  'isAccountSubscribedToWebApp',
  'revokeAccessToWebApp',
];

// ************************************************************************
// * Heartbeat API - https://api.betfair.com:443/exchange/betting/json-rpc/v1/
// ************************************************************************
const API_HEARTBEAT_METHODS = [
  'heartbeat',
];

// ************************************************************************
// * Scores API - https://api.betfair.com:443/exchange/scores/json-rpc/v1/
// ************************************************************************
const API_SCORES_METHODS = [
  'listRaceDetails',
  'listScores',
  'listIncidents',
  'listAvailableEvents',
];

class BetfairSession {
  // Constructor
  constructor(applicationKey, sessionKey = null) {
    this.sessionKey = sessionKey;
    this.applicationKey = applicationKey;
    this.email = null;
    this.allSports = {};
    // this.exchangeStream = null;
    BetfairInvocation.setApplicationKey(applicationKey);

    this.createApiMethods('betting', API_BETTING_METHODS);
    this.createApiMethods('accounts', API_ACCOUNT_METHODS);
    this.createApiMethods('heartbeat', API_HEARTBEAT_METHODS);
    this.createApiMethods('scores', API_SCORES_METHODS);
  }

  setSession(sessionKey) {
    this.sessionKey = sessionKey;
    BetfairInvocation.setSessionKey(sessionKey);
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken;
    BetfairInvocation.setAccessToken(accessToken);
  }

  setEmailAddress(email) {
    this.email = email;
  }

  login(login, password) {
    return new Promise((res, rej) => {
      auth.loginInteractive(login, password, (error, result) => {
        if (error) rej(error);
        if (result) {
          this.setSession(result.sessionKey);
          this.setEmailAddress(login);
        }
        res(result);
      });
    });
  }

  keepAlive() {
    return new Promise((res, rej) => {
      auth.keepAlive(this.accessToken, (err, result) => {
        if (err) rej(err);
        res(result);
      });
    });
  }

  logout() {
    return new Promise((res) => {
      auth.logout(this.accessToken, (err, result) => {
        if (err) res(err);
        res(result);
      });
    });
  }

  reset() {
    this.setSession(null);
    this.email = null;
    this.setAccessToken(null);
  }

  createExchangeStream(client) {
    return new ExchangeStream(client, this.sessionKey);
  }

  // Create multiple Betfair API calls (account API, bettint api, etc)
  createApiMethods(api, methods) {
    methods.forEach((method) => {
      BetfairSession.prototype[method] = this.createMethod(api, method);
    });
  }

  // Arbitrary Betfair API RPC call constructor
  createMethod(api, methodName) {
    return function (params, callback = () => {}) {
      if (!_.isObject(params)) {
        throw ('params should be object');
      }
      const invocation = new BetfairInvocation(api, methodName, params);

      invocation.execute((err, result) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, result);
      });
      return invocation;
    };
  }
}

module.exports = BetfairSession;
