// (C) 2016 Anton Zemlyanov, rewritten in JavaScript 6 (ES6)
'use strict';
var Promise = require("bluebird");

let _ = require('lodash');
let auth = require('./auth.js');
let BetfairInvocation = require('./invocation.js');
let Logger = require('./logger.js');
// let Emulator = require('betfair-emulator');
//let Emulator = require('/opt/projects/betfair-emulator');

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
    'updateOrders'
];

// ************************************************************************
// * Accounts API - https://api.betfair.com:443/exchange/account/json-rpc/v1/
// ************************************************************************
const API_ACCOUNT_METHODS = [
    'createDeveloperAppKeys',
    'getDeveloperAppKeys',
    'getAccountDetails',
    'getAccountFunds',
    'getDeveloperAppKeys',
    'getVendorClientId',
    'getVendorDetails',
    'getAccountStatement',
    'listCurrencyRates',
    'transferFunds'
];

// ************************************************************************
// * Heartbeat API - https://api.betfair.com:443/exchange/betting/json-rpc/v1/
// ************************************************************************
const API_HEARTBEAT_METHODS = [
    'heartbeat'
];

// ************************************************************************
// * Scores API - https://api.betfair.com:443/exchange/scores/json-rpc/v1/
// ************************************************************************
const API_SCORES_METHODS = [
    'listRaceDetails',
    'listScores',
    'listIncidents',
    'listAvailableEvents'
];

class BetfairSession {
    // Constructor
    constructor(applicationKey, options={}) {
        this.sessionKey = null;
        this.applicationKey = applicationKey;
        BetfairInvocation.setApplicationKey(applicationKey);

        this.createApiMethods('betting', API_BETTING_METHODS);
        this.createApiMethods('accounts', API_ACCOUNT_METHODS);
        this.createApiMethods('heartbeat', API_HEARTBEAT_METHODS);
        this.createApiMethods('scores', API_SCORES_METHODS);

        // optionaly init emulator
        if(options.emulator) {
            let level = options.emulatorLogLevel || 'info';
            let logger = new Logger('emu', level);
            if(options.emulatorLogFile) {
                logger.addFileLog(options.emulatorLogFile)
            }
            this.emulator = new Emulator(logger);
            BetfairInvocation.setEmulator(this.emulator);
        }
    }

    startInvocationLog(logger) {
        auth.startInvocationLog(logger);
        BetfairInvocation.startInvocationLog(logger);
    }

    stopInvocationLog() {
        auth.stopInvocationLog();
        BetfairInvocation.stopInvocationLog();
    }

    setSslOptions() {
        // TODO, bot login is not supported yet
    }

    enableEmulationForMarket(marketId) {
        if(!this.emulator) {
            throw new Error('Emulator is not enabled');
        }
        this.emulator.enableEmulationForMarket(marketId);
    }

    disableEmulationForMarket(marketId) {
        if(!this.emulator) {
            throw new Error('Emulator is not enabled');
        }
        this.emulator.disableEmulationForMarket(marketId);
    }

    isEmulatedMarket(marketId) {
        if(!this.emulator) {
            throw new Error('Emulator is not enabled');
        }
        return this.emulator.isEmulatedMarket(marketId);
    }

    login(login, password, cb = ()=> {}) {
        return new Promise((res, rej) => {
            auth.loginInteractive(login, password, (err, result) => {
                if (err) {
                    // cb(err);
                    rej(this);
                    // return;
                }
                this.sessionKey = result.sessionKey;
                // cb(null, res);
                res(this);
            });
        });
    }

    keepAlive(cb = ()=> {}) {
        auth.keepAlive(this.sessionKey, (err, res) => {
            cb(err, res);
        });
    }

    logout(cb = ()=> {}) {
        auth.logout(this.sessionKey, (err, res) => {
            cb(err, res);
        });
    }

    // Create multiple Betfair API calls (account API, bettint api, etc)
    createApiMethods(api, methods) {
        methods.forEach((method) => {
            BetfairSession.prototype[method] = this.createMethod(api, method);
        })
    }

    // Arbitrary Betfair API RPC call constructor
    createMethod(api, methodName) {
        return function(params, callback = ()=> {}) {
            if (!_.isObject(params)) {
                throw('params should be object');
            }
            let invocation = new BetfairInvocation(api, this.sessionKey, methodName, params);
            invocation.execute((err, result) => {
                //console.log(methodName, 'error', err, 'result', result);
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, result);
            });
            return invocation;
        }
    }
}

module.exports = BetfairSession;