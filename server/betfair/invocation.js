const _ = require('lodash');
const HttpRequest = require('./http_request.js');

// BETFAIR API enpoints
const BETFAIR_API_HOST = 'https://api.betfair.com';
const BETFAIR_API_ENDPOINTS = {
  accounts: {
    type: 'AccountAPING',
    version: 'v1.0',
    service: `${BETFAIR_API_HOST}/exchange/account/json-rpc/v1/`,
  },
  betting: {
    type: 'SportsAPING',
    version: 'v1.0',
    service: `${BETFAIR_API_HOST}/exchange/betting/json-rpc/v1/`,
  },
  heartbeat: {
    type: 'HeartbeatAPING',
    version: 'v1.0',
    service: `${BETFAIR_API_HOST}/exchange/heartbeat/json-rpc/v1`,
  },
  scores: {
    type: 'ScoresAPING',
    version: 'v1.0',
    service: `${BETFAIR_API_HOST}/exchange/scores/json-rpc/v1/`,
  },
};

// Betfair Exchange JSON-RPC API invocation (excluding Auth stuff)
class BetfairInvocation {
  static setSessionKey(sessionKey) {
    BetfairInvocation.sessionKey = sessionKey;
  }

  static setAccessToken(accessToken) {
    BetfairInvocation.accessToken = accessToken;
  }

  static setApplicationKey(appKey) {
    BetfairInvocation.applicationKey = appKey;
  }

  static startInvocationLog(logger) {
    BetfairInvocation.logger = logger;
  }

  static stopInvocationLog() {
    BetfairInvocation.logger = null;
  }

  static setEmulator(emulator) {
    BetfairInvocation.emulator = emulator;
  }

  constructor(api, method, params = {}, isEmulated = false) {
    if (api !== 'accounts' && api !== 'betting' && api !== 'heartbeat' && api !== 'scores') {
      throw new Error(`Bad api parameter:${api}`);
    }

    // input params
    this.api = api;
    this.method = method;
    this.params = params;
    this.isEmulated = isEmulated;

    // Request and Response stuff
    this.apiEndpoint = BETFAIR_API_ENDPOINTS[api] || BETFAIR_API_ENDPOINTS.betting;
    this.applicationKey = BetfairInvocation.applicationKey;
    this.service = this.apiEndpoint.service;
    this.request = {
      jsonrpc: '2.0',
      id: BetfairInvocation.jsonRpcId += 1,
      method: `${this.apiEndpoint.type}/${this.apiEndpoint.version}/${this.method}`,
      params: this.params,
    };
    this.response = null;
  }

  execute(cb = () => { }) {
    const callback = _.once(cb);
    this.jsonRequestBody = JSON.stringify(this.request);
    const httpOptions = {
      headers: {
        'X-Application': this.applicationKey,
        // Authorization: `BEARER ${BetfairInvocation.accessToken}`,
        'X-Authentication': BetfairInvocation.sessionKey,
        'Content-Type': 'application/json',
        'Content-Length': this.jsonRequestBody.length,
        'Accept-Encoding': 'gzip, deflate',
        Connection: 'keep-alive',
      },
    };

    HttpRequest.post(this.service, this.jsonRequestBody, httpOptions, (err, result) => {
      if (err) {
        callback(err);
        return;
      }
      // log invocation
      if (BetfairInvocation.logger) {
        BetfairInvocation.logger.info(this.method, {
          api: this.api,
          duration: result.duration,
          isSuccess: !(result.responseBody && result.responseBody.error),
          length: result.length,
          httpStatusCode: result.statusCode,
        });
      }
      callback(null, {
        request: this.request,
        response: result.responseBody,
        result: result.responseBody && result.responseBody.result,
        error: result.responseBody && result.responseBody.error,
        duration: result.duration,
      });
    });
  }
}

BetfairInvocation.jsonRpcId = 1;

module.exports = BetfairInvocation;
