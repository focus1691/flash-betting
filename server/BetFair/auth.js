let HttpRequest = require('./http_request.js');
let querystring = require('querystring');

const AUTH_URLS = {
    interactiveLogin: 'https://identitysso.betfair.com:443/api/login',
    botLogin: 'https://identitysso-api.betfair.com:443/api/certlogin',
    logout: 'https://identitysso.betfair.com:443/api/logout',
    keepAlive: 'https://identitysso.betfair.com:443/api/keepAlive'
};

class BetfairAuth {
    startInvocationLog(logger) {
        this.logger = logger;
    }

    stopInvocationLog() {
        this.logger = null;
    }

    logAuthCall(method, result) {
        if (this.logger) {
            this.logger.info(method, {
                api: 'auth',
                duration: result.duration,
                isSuccess: !(result.responseBody && result.responseBody.error),
                length: result.length,
                httpStatusCode: result.statusCode
            });
        }
    }

    loginInteractive(login, password, cb = ()=> {}) {
        let formData = querystring.stringify({
            username: login,
            password: password,
            login: true,
            redirectMethod: 'POST',
            product: 'home.betfair.int',
            url: 'https://www.betfair.com/'
        });
        let options = {
            headers: {
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded",
                'content-length': formData.length,
                'x-application': 'BetfairAPI'
            }
        };
        HttpRequest.post(AUTH_URLS.interactiveLogin, formData, options, (err, res) => {
            if (err) {
                cb(err);
                return;
            }
            if (res.responseBody.status != 'SUCCESS') {
                cb(res.responseBody.error);
                return;
            }
            cb(null, {
                success: res.responseBody.status == 'SUCCESS',
                sessionKey: res.responseBody.token,
                duration: res.duration,
                responseBody: res.responseBody
            });
            // log successful result
            this.logAuthCall('loginInteractive', res);
        });
    }

    logout(sessionKey, cb = ()=> {}) {
        let formData = querystring.stringify({
            product: 'home.betfair.int',
            url: 'https://www.betfair.com/'
        });

        let options = {
            headers: {
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded",
                'content-length': formData.length,
                "x-authentication": sessionKey
            }
        };
        HttpRequest.post(AUTH_URLS.logout, formData, options, (err, res) => {
            if(err) {
                cb(err);
                return;
            }
            if (res.responseBody.status !== 'SUCCESS') {
                cb(res.responseBody.error);
                return;
            }
            cb(null, {
                success: res.responseBody.status === 'SUCCESS',
                duration: res.duration,
                responseBody: res.responseBody
            });
            // log successful result
            this.logAuthCall('logout', res);
        });
    }

    keepAlive(sessionKey, cb = ()=> {}) {
        let formData = querystring.stringify({
            product: 'home.betfair.int',
            url: 'https://www.betfair.com/'
        });

        let options = {
            headers: {
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded",
                'content-length': formData.length,
                "x-authentication": sessionKey
            }
        };
        HttpRequest.post(AUTH_URLS.keepAlive, formData, options, (err, res) => {
            if(err) {
                cb(err);
                return;
            }
            if (res.responseBody.status != 'SUCCESS') {
                cb(res.responseBody.error);
                return;
            }
            cb(null, {
                success: res.responseBody.status == 'SUCCESS',
                duration: res.duration,
                responseBody: res.responseBody
            });
            // log successful result
            this.logAuthCall('keepAlive', res);
        });
    }
}

module.exports = new BetfairAuth();