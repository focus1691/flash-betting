/* eslint-disable class-methods-use-this */
const express = require('express');
const _ = require('lodash');

class BetFairBettingController {
  constructor() {
    this.path = '/api';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/get-events-with-active-bets', this.getEventWithActiveBets);
    this.router.get('/list-market-pl', this.getMarketPL);
    this.router.get('/get-market-info', this.getMarketInfo);
    this.router.get('/list-market-book', this.getMarketBook);
    this.router.post('/place-order', this.placeOrders);
    this.router.post('/cancel-order', this.cancelOrders);
    this.router.post('/update-orders', this.updateOrders);
    this.router.post('/replace-orders', this.replaceOrders);
    this.router.get('/listCurrentOrders', this.getCurrentOrders);
    this.router.get('/list-order-to-duplicate', this.getOrdersToDuplicate);
    this.router.get('/list-cleared-orders', this.getClearedOrders);
    this.router.get('/list-recent-orders', this.getRecentOrders);
  }

  getEventWithActiveBets(req, res) {
    req.betfair.listCurrentOrders({ filter: {} }, async (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }

      const filteredOrders = _.uniq(result.currentOrders.map((order) => order.marketId));

      if (filteredOrders.length <= 0) return res.json({ result: [] });

      return req.betfair.listMarketCatalogue({
        filter: {
          marketIds: filteredOrders
        },
        maxResults: 100,
        marketProjection: ['EVENT'],
      }, (err, { error, result }) => {
        if (error) {
          return res.status(401).json({ error });
        }
        return res.json({ result });
      });
    });
  }

  getMarketPL(req, res) {
    req.betfair.listMarketProfitAndLoss(
      {
        marketIds: [req.query.marketId],
      },
      (err, { error, result }) => {
        if (error) {
          return res.status(401).json({
            error,
          });
        }
        return res.json({ result });
      },
    );
  }

  getMarketInfo(req, res) {
    req.betfair.listMarketCatalogue(
      {
        filter: {
          marketIds: [req.query.marketId],
        },
        marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME', 'MARKET_DESCRIPTION', 'RUNNER_DESCRIPTION', 'RUNNER_METADATA'],
        maxResults: 1,
      },
      (err, { result, error }) => {
        if (error) {
          return res.status(401).json({
            error,
          });
        }
        return res.json({ result });
      },
    );
  }

  getMarketBook(req, res) {
    const { marketId } = req.query;
    req.betfair.listMarketBook({ marketIds: [marketId], priceProjection: { priceData: ['EX_TRADED', 'EX_ALL_OFFERS'] } }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }

  placeOrders(req, res) {
    const { marketId, selectionId, side, size, price, customerStrategyRef } = req.body;
    req.betfair.placeOrders(
      {
        marketId,
        instructions: [
          {
            selectionId,
            side,
            orderType: 'LIMIT',
            limitOrder: {
              size,
              price,
            },
          },
        ],
        customerStrategyRef,
      },
      (err, { error, result }) => {
        if (error) {
          return res.status(401).json({
            error,
          });
        }
        return res.json({ result });
      },
    );
  }

  cancelOrders(req, res) {
    req.betfair.cancelOrders(
      {
        marketId: req.body.marketId,
        instructions: [
          {
            betId: req.body.betId,
            sizeReduction: req.body.sizeReduction,
          },
        ],
      },
      (err, { error, result }) => {
        if (error) {
          return res.status(401).json({
            error,
          });
        }
        return res.json({ result });
      },
    );
  }

  updateOrders(req, res) {
    const { marketId, betId, customerStrategyRef } = req.body;
    req.betfair.placeOrders(
      {
        marketId,
        instructions: [{ betId, newPersistenceType: 'PERSIST' }],
        customerStrategyRef,
      },
      (err, { error, result }) => {
        if (error) {
          return res.status(401).json({ error });
        }
        return res.json({ result });
      },
    );
  }

  replaceOrders(req, res) {
    const { marketId, betId, newPrice } = req.body;
    req.betfair.replaceOrders({ marketId, instructions: [{ betId, newPrice }] }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }

  getCurrentOrders(req, res) {
    req.betfair.listCurrentOrders({ marketIds: [req.query.marketId] }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }

  getOrdersToDuplicate(req, res) {
    req.betfair.listCurrentOrders(
      {
        marketIds: [req.query.marketId],
        OrderProjection: 'EXECUTABLE',
        SortDir: 'LATEST_TO_EARLIEST',
      },
      (err, { error, result }) => {
        if (error) {
          return res.status(401).json({ error });
        }
        return res.json({ result });
      },
    );
  }

  getClearedOrders(req, res) {
    req.betfair.listClearedOrders({ betStatus: 'SETTLED', fromRecord: 0, recordCount: 0, groupBy: 'MARKET' }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }

  getRecentOrders(req, res) {
    req.betfair.listClearedOrders({ betStatus: 'SETTLED', recordCount: 10, groupBy: 'MARKET' }, (err, { error, result }) => {
      if (error) {
        return res.status(401).json({ error });
      }
      return res.json({ result });
    });
  }
}

module.exports = BetFairBettingController;
