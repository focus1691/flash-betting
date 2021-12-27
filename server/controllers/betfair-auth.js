/* eslint-disable class-methods-use-this */
const express = require('express');
const APIHelper = require('../api/helper');

class BetFairAuthenticationController {
  constructor() {
    this.path = '/api';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/login', this.login);
    this.router.get('/logout', this.logout);
    this.router.get('/registration-status', this.registrationStatus);
    this.router.get('/authenticate-user', this.authenticate);
    this.router.get('/keep-alive', this.keepAlive);
  }

  login(req, res) {
    const { user, password } = req.body;
    req.betfair.login(user, password).then(async ({ sessionKey }) => {
      res.cookie('sessionKey', sessionKey);
      res.cookie('username', user);
      res.status(200).json({ sessionKey });
    }).catch((error) => res.status(401).json({ error }));
  }

  logout(req, res) {
    req.betfair.logout().then((res) => {
      this.clearSession(res);
      res.json(res);
    }).catch((error) => res.json({ error }));
  }

  async registrationStatus(req, res) {
    if (!req.cookies.username) {
      return res.status(400).json({ error: 'Username not found' });
    }
    const isRegistered = await APIHelper.isUserRegistered(req.cookies.username);
    return res.status(200).json({ result: isRegistered });
  }

  async authenticate(req, res) {
    if (!req.cookies.username) {
      return res.status(400).json({ error: 'Username not found' });
    }
    if (!req.cookies.token) {
      // const accessToken = await apiHelper.getAccessToken(req.cookies.token);
      // req.betfair.getVendorClientId({}, async (err, { error, result }) => {
      // if (error) {
      //   return res.status(401).json({ error });
      // }

      const token = await APIHelper.login({ user: req.cookies.username });

      if (token) {
        res.cookie('token', token);
        return res.status(200).json({ result: token });
      }
      return res.status(400).json({ error: 'Cannot authenticate' });
      // });
    }
    return res.status(200).json({ result: req.cookies.token });
  }

  clearSession(res) {
    res.clearCookie('token');
    res.clearCookie('sessionKey');
    res.clearCookie('accessToken');
    res.clearCookie('username');
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
