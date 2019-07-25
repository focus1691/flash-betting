'use strict';

const https = require('https');
var Promise = require("bluebird");

var DEFAULT_ENCODING = 'utf-8';



class BetFairBetting {
	constructor (applicationKey, sessionKey) {
        this.applicationKey = applicationKey;
        this.sessionKey = sessionKey;

		this.options = {
		    hostname: 'api.betfair.com',
		    port: 443,
		    path: '/exchange/betting/json-rpc/v1',
		    method: 'POST',
		    headers: {
		        'X-Application' : this.applicationKey,
		        'Accept': 'application/json',
		        'Content-type' : 'application/json',
		        'X-Authentication' : this.sessionKey
		        }
	    }
	}
    findEvents () {
        return new Promise((res, rej) => {
    		// console.log("Get horse racing event id");
    		// Define Horse Racing in filter object
            var requestFilters = '{"filter":{}}';
            var jsonRequest = this.constructJsonRpcRequest('listEventTypes', requestFilters );
            var str = '';
            var req = https.request(this.options,function (result) {
                result.setEncoding(DEFAULT_ENCODING);
                result.on('data', function (chunk) {
                    // console.log(chunk);
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
    getNextAvailableHorseRace(response) {
        return new Promise((res, rej) => {
            // Retrieve event id from previous response
            var eventId = this.retrieveEventId(response);
            var jsonDate = new Date().toJSON();
            // console.log("Get next available horse race starting from date: " + jsonDate);
            var str = '';
            var requestFilters = '{"filter":{"eventTypeIds": [' + eventId + '],"marketCountries":["GB"],"marketTypeCodes":["WIN"],"marketStartTime":{"from":"'+jsonDate+'"}},"sort":"FIRST_TO_START","maxResults":"1","marketProjection":["RUNNER_DESCRIPTION"]}';
            var jsonRequest = this.constructJsonRpcRequest('listMarketCatalogue', requestFilters );
            
            var req = https.request(this.options,function (result){
                result.setEncoding(DEFAULT_ENCODING);
                result.on('data', function (chunk) {
                    str += chunk;
                });

                result.on('end', function (chunk) {
                    var response = JSON.parse(str);
                    res(response);
                    // console.log(response);
                    // handleError(response);
                    // Get list of runners that are available in that race
                    // getListOfRunners(this.options, response);
                });
            });
            req.write(jsonRequest, DEFAULT_ENCODING);
            req.end();
            req.on('error', function(e) {
                console.log('Problem with request: ' + e.message);
                rej(e);
            });
        });
    }
    retrieveEventId(response) {
        for (var i = 0; i<= Object.keys(response.result).length; i++ ) {
            if (response.result[i].eventType.name == 'Horse Racing'){
                return response.result[i].eventType.id;
            }
        }
    }
    constructJsonRpcRequest (operation, params) {
        return '{"jsonrpc":"2.0","method":"SportsAPING/v1.0/' +  operation + '", "params": ' + params + ', "id": 1}';
    }
    handleError (response) {
        // check for errors in response body, we can't check for status code as jsonrpc returns always 200
        if (response.error != null) {
            // if error in response contains only two fields it means that there is no detailed message of exception thrown from API-NG
            if (Object.keys(response.error).length > 2) {
                console.log("Error with request!!");
                console.log(JSON.stringify(response, null, DEFAULT_JSON_FORMAT));
                console.log("Exception Details: ");
                console.log(JSON.stringify(retrieveExceptionDetails(response), null, DEFAULT_JSON_FORMAT));
            }
            process.exit(1);
        }
    }
}

module.exports = BetFairBetting;