/* eslint-disable class-methods-use-this */
const express = require('express');

class BetFairAuthenticationController {
  constructor() {
    this.path = '/api';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/login', this.login);
    this.router.get('/logout', this.logout);
    this.router.get('/keep-alive', this.keepAlive);
  }

  login(req, res) {
    const { user, password } = req.body;
    req.betfair.login(user, password).then(async (result) => {
      res.cookie('sessionKey', result.sessionKey);
      res.cookie('username', user);
      res.json(result);
    }).catch((error) => res.json({ error }));
  }

  logout(req, res) {
    req.betfair.logout().then((res) => {
      res.clearCookie('sessionKey');
      res.clearCookie('accessToken');
      res.clearCookie('username');
      res.json(res);
    }).catch((error) => res.json({ error }));
  }

  keepAlive(req, res) {
    req.betfair.keepAlive().then(async (result) => {
      res.json(result);
    }).catch((error) =>
      res.json({
        error,
      }),
    );
  }
}

module.exports = BetFairAuthenticationController;
