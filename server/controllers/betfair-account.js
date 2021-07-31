/* eslint-disable class-methods-use-this */
const express = require('express');

class BetFairAccountController {
  constructor() {
    this.path = '/api';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/get-subscription-status', this.getSubscriptionStatus);
    this.router.get('/revoke-subscription-status', this.revokeSubscription);
    this.router.get('/get-vendor-client-id', this.getVendorClientId);
    this.router.get('/get-account-balance', this.getAccountBalance);
    this.router.get('/get-account-details', this.getAccountDetails);
  }

  getSubscriptionStatus(req, res) {
    req.betfair.isAccountSubscribedToWebApp({ vendorId: process.env.VENDOR_ID }, async (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      const accessToken = await req.apiHelper.getAccessToken();
      return res.status(200).json({
        result: {
          isSubscribed: result,
          accessToken,
          vendorId: process.env.VENDOR_ID,
        },
      });
    });
  }

  revokeSubscription(req, res) {
    req.betfair.revokeAccessToWebApp({ vendorId: process.env.VENDOR_ID }, async (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.status(200).json({ result });
    });
  }

  getVendorClientId(req, res) {
    req.betfair.getVendorClientId({}, async (err, { error, result }) => {
      if (error) {
        return res.status(401).json({
          error,
        });
      }
      return res.status(200).json({ result });
    });
  }

  getAccountBalance(req, res) {
    req.betfair.getAccountFunds({ filter: {} }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }

  getAccountDetails(req, res) {
    req.betfair.getAccountDetails({ filter: {} }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }
}

module.exports = BetFairAccountController;
