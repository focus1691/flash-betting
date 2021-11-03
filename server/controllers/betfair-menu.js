/* eslint-disable class-methods-use-this */
const express = require('express');
const fetch = require('node-fetch');
const _ = require('lodash');

class BetFairMenuController {
  constructor() {
    this.path = '/api';
    this.router = express.Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/fetch-all-sports', this.loadSportsMenu);
    this.router.get('/fetch-sport-data', this.getSportData);
    this.router.get('/get-all-sports', this.getAllSports);
    this.router.get('/list-todays-card', this.getTodaysCard);
  }

  loadSportsMenu(req, response) {
    req.betfair.allSports = {};
    const headers = {
      'X-Application': process.env.APP_KEY,
      'X-Authentication': req.betfair.sessionKey,
      'Accept-Encoding': 'gzip, deflate',
    };
    fetch('	https://api.betfair.com/exchange/betting/rest/v1/en/navigation/menu.json', {
      headers,
    })
      .then((res) => res.json())
      .then((res) => {
        res.children.forEach((item) => {
          req.betfair.allSports[item.id] = item.children;
        });
        response.status(200).json({ sports: req.betfair.allSports });
      })
      .catch((error) => {
        response.status(400).json({ error: error.message });
      });
  }

  getSportData(req, res) {
    if (req.betfair.allSports[req.query.id]) {
      return res.json({ result: req.betfair.allSports[req.query.id] });
    }
    return res.status(400).json({ error: 'All Sports contains no data' });
  }

  getAllSports(req, res) {
    req.betfair.listEventTypes({
      filter: {},
    },
      (err, { error, result }) => {
        if (error) {
          return res.sendStatus(400).json({ error });
        }
        return res.json({ result });
      });
  }

  getTodaysCard(req, res) {
    const filter = {
      eventTypeIds: [req.query.id],
      marketStartTime: {
        from: new Date(new Date().setSeconds(new Date().getSeconds() - 3600)).toJSON(),
        to: new Date(new Date().setSeconds(new Date().getSeconds() + 86400)).toJSON(),
      },
    };

    if (!_.isEmpty(req.query.marketTypes)) {
      filter.marketTypeCodes = [req.query.marketTypes];
    }
    if (!_.isEmpty(req.query.country)) {
      filter.marketCountries = JSON.parse(req.query.country);
    }

    req.betfair.listMarketCatalogue(
      {
        filter,
        sort: 'FIRST_TO_START',
        maxResults: '1000',
        marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'MARKET_START_TIME'],
      },
      (err, { error, result }) => {
        if (error) {
          return res.status(401).json({
            error,
          });
        }

        // if its the next day, we have to put the date
        const mappedResponseNames = result.map((item) => {
          const marketStartTime = new Date(item.marketStartTime);
          const currentDay = new Date(Date.now()).getDay();
          const marketStartDay = marketStartTime.getDay();
          const marketStartOnDiffDay = marketStartDay > currentDay || marketStartDay < currentDay;

          const dateSettings = {
            hour12: false,
          };
          if (marketStartOnDiffDay) {
            dateSettings.weekday = 'short';
          }
          const marketStartDate = marketStartTime.toLocaleTimeString('en-us', dateSettings);
          return Object.assign(item, {
            marketName: `${marketStartDate} ${item.event.venue} ${item.marketName}`,
          });
        });

        const sortByTime = (a, b) => Date.parse(a.marketStartTime) - Date.parse(b.marketStartTime);

        const sortedResponse = mappedResponseNames.sort(sortByTime);

        const mappedResponse = sortedResponse.map((item) => ({
          id: item.marketId,
          name: item.marketName,
          type: 'MARKET',
        }));
        res.json({ result: mappedResponse });
      },
    );
  }
}

module.exports = BetFairMenuController;
