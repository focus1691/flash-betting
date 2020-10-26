/* eslint-disable max-len */
const Database = require('sqlite-async');

const fakeBet = {
  strategy: 'BACK',
  marketId: '1.232323',
  size: 2,
  price: '2.02',
  side: 'BACK',
  betId: '23232232',
  rfs: '142124124sdffs',
  trailing: false,
  hedged: false,
  assignedIsOrderMatched: false,
};

const fakeBet2 = {
  strategy: 'Stop Loss',
  marketId: '1.6633432',
  size: 50,
  price: '5.5',
  side: 'LAY',
  betId: '555555555',
  rfs: '1vsdfsfds5345',
  trailing: false,
  hedged: false,
  assignedIsOrderMatched: false,
};

class SQLiteDatabase {
  constructor() {
    this.setup();
  }

  async setup() {
    this.db = await Database.open(':memory:').then(async (db) => db);
    await this.db.run(
      'CREATE TABLE bets (strategy TEXT, marketId TEXT, size INT, price TEXT, side TEXT, betId TEXT, rfs TEXT, trailing BOOLEAN, hedged BOOLEAN, assignedIsOrderMatched BOOLEAN, tickOffset INT, units TEXT, percentageTrigger INT, executionTime TEXT, timeOffset INT, seconds INT, startTime INT, targetLTP INT, stopEntryCondition TEXT)'
    );
    await this.addBet(fakeBet);
    await this.addBet(fakeBet2);
    await this.getBets();
  }

  async addBet(bet) {
    const {
      strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition
    } = bet;
    const stmt = await this.db.prepare('INSERT INTO bets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition);
    stmt.finalize();
  }

  async getBets() {
    const rows = [];
    await this.db.each(
      'SELECT strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition FROM bets',
      (err, row) => {
        rows.push(row);
      },
    );
    return rows;
  }

  close() {
    this.db.close();
  }
}

module.exports = new SQLiteDatabase();
