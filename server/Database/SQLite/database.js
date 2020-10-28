/* eslint-disable max-len */
const Database = require('sqlite-async');

class SQLiteDatabase {
  async setup() {
    this.db = await Database.open(':memory:').then(async (db) => db);
    await this.db.run(
      'CREATE TABLE bets (strategy TEXT, marketId TEXT, size INT, price TEXT, side TEXT, betId TEXT, rfs TEXT, trailing BOOLEAN, hedged BOOLEAN, assignedIsOrderMatched BOOLEAN, tickOffset INT, units TEXT, percentageTrigger INT, executionTime TEXT, timeOffset INT, seconds INT, startTime INT, targetLTP INT, stopEntryCondition TEXT)'
    );
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

  async updateBet(bet) {
    const stmt = await this.db.prepare('INSERT INTO bets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition);
    stmt.finalize();
  }

  close() {
    this.db.close();
  }
}

module.exports = new SQLiteDatabase();
