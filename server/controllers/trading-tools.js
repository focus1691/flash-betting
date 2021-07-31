/* eslint-disable class-methods-use-this */
const express = require('express');
const db = require('../sqlite/database');

db.setup();

class TradingToolsController {

  constructor() {
    this.path = '/api';
    this.router = express.Router();
    this.initRoutes();

    this.db = db;
  }

  initRoutes() {
    this.router.get('/get-all-bets', this.getAllBets);
    this.router.post('/save-bet', this.saveBet);
    this.router.post('/update-price', this.updatePrice);
    this.router.post('/update-stop-loss', this.updateStopLoss);
    this.router.post('/update-ticks', this.updateTicks);
    this.router.post('/update-bet-matched', this.updateBetMatched);
    this.router.post('/remove-bet', this.removeBet);
    this.router.post('/remove-selection-bets', this.removeSelectionBets);
    this.router.post('/remove-selection-bets-on-side', this.removeSelectionBetsOnSide);
    this.router.post('/remove-all-bets', this.removeAllBets);
  }

  getAllBets(req, res) {
    db.getBets(req.query.marketId).then((bets) => res.json(bets));
  }

  saveBet(req, res) {
    db.addBet(req.body).then(() => res.json({ message: 'Bet saved' }));
  }

  updatePrice(req, res) {
    db.updatePrice(req.body).then(() => res.json({ message: 'Price updated' }));
  }

  updateStopLoss(req, res) {
    db.updateStopLoss(req.body).then(() => res.json({ message: 'Stop Loss updated' }));
  }

  updateTicks(req, res) {
    db.updateTicks(req.body).then(() => res.json({ message: 'Ticks updated' }))
  }

  updateBetMatched(req, res) {
    db.updateOrderMatched(req.body).then(() =>
      res.json({
        message: 'Updated the bet to matched',
      }),
    );
  }

  removeBet(req, res) {
    db.removeBet(req.body).then(() =>
      res.json({
        message: 'Removed bet',
      }),
    );
  }

  removeSelectionBets(req, res) {
    db.removeSelectionBets(req.body).then(() =>
      res.json({
        message: 'Removed selection bets',
      }),
    );
  }

  removeSelectionBetsOnSide(req, res) {
    db.removeSelectionBetsOnSide(req.body).then(() =>
      res.json({
        message: 'Removed selection bets on side',
      }),
    );
  }

  removeAllBets(req, res) {
    db.removeAllBets(req.body).then(() =>
      res.json({
        message: 'Removed all bets',
      }),
    );
  }
}

module.exports = TradingToolsController;
