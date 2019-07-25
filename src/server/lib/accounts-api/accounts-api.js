'use strict';

const https = require('https');
var Promise = require("bluebird");

var DEFAULT_ENCODING = 'utf-8';
var DEFAULT_JSON_FORMAT = '\t';

class BetFairAccount {
	constructor (applicationKey, sessionKey) {
        this.applicationKey = applicationKey;
        this.sessionKey = sessionKey;

		this.options = {
		    hostname: 'api.betfair.com',
		    port: 443,
		    path: '/exchange/account/json-rpc/v1',
		    method: 'POST',
		    headers: {
		        'X-Application' : this.applicationKey,
		        'Accept': 'application/json',
		        'Content-type' : 'application/json',
		        'X-Authentication' : this.sessionKey
		    }
	    }
	}
	getAccountFunds () {
		return new Promise((res, rej) => {
            var requestFilters = '{"filter":{}}';
            var jsonRequest = this.constructJsonRpcRequest('getAccountFunds', requestFilters );
            var str = '';
            var req = https.request(this.options,function (result) {
                result.setEncoding(DEFAULT_ENCODING);
                result.on('data', function (chunk) {
                	console.log(chunk);
                    str += chunk;
                });

                result.on('error', function(err) {
                    console.log('Error:' + err);
                    // rej(err);
                });

                result.on('end', function (chunk) {
    				// On resposne parse Json and check for errors
                    var response = JSON.parse(str);
                    res(response);
                    // console.log(response);
                    // this.handleError(response);
                    // Retrieve id from response and get next available horse race
                    // getNextAvailableHorseRace(options, response);
                });
                
            });
            // Send Json request object
            req.write(jsonRequest, DEFAULT_ENCODING);
            req.end();

            req.on('error', function(e) {
                console.log('Problem with request: ' + e.message);
                rej(err);
            });
		});
	}
    constructJsonRpcRequest (operation, params) {
        return '{"jsonrpc":"2.0","method":"AccountAPING/v1.0/' +  operation + '", "params": ' + params + ', "id": 1}';

    }
}

module.exports = BetFairAccount;