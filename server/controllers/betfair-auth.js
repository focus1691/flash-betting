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
    this.router.get('/logout', this.logout.bind(this));
    this.router.get('/registration-status', this.registrationStatus);
    this.router.get('/authenticate-user', this.authenticate);
    this.router.get('/keep-alive', this.keepAlive);
  }

  login(req, res) {
    const { user, password } = req.body;
    req.betfair
      .login(user, password)
      .then(async ({ sessionKey }) => {
        res.cookie('sessionKey', sessionKey);
        res.cookie('username', user);
        res.status(200).json({ sessionKey });
      })
      .catch((error) => res.status(401).json({ error }));
  }

  async logout(req, res) {
    try {
      await req.betfair.logout();
      this.clearSession(res);
      req.betfair.reset();

      if (req.sseStream) {
        req.sseStream.write({
          event: 'close-tabs',
          data: new Date().toTimeString(),
        });
      }
      return res.sendStatus(200);
    } catch (error) {
      return res.sendStatus(400).json({ error });
    }
  }

  clearSession(res) {
    res.clearCookie('token');
    res.clearCookie('sessionKey');
    res.clearCookie('accessToken');
    res.clearCookie('username');
  }

  keepAlive(req, res) {
    req.betfair
      .keepAlive()
      .then(async (result) => {
        return res.json(result);
      })
      .catch((error) => {
        return res.json({ error });
      });
  }
}

module.exports = BetFairAuthenticationController;
