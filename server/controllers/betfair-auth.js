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
    req.betfair.login(user, password).then(async ({ sessionKey }) => {
      req.betfair.getVendorClientId({}, async (err, { error, result }) => {
        if (error) return res.status(401).json({ error });

        res.cookie('token', result);
        res.cookie('sessionKey', sessionKey);
        res.cookie('username', user);
        res.json(result);

        return res.status(200).json(result);
      });
    }).catch((error) => res.json({ error }));
  }

  logout(req, res) {
    req.betfair.logout().then((res) => {
      res.clearCookie('token');
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
