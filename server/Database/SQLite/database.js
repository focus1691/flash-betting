/* eslint-disable max-len */
const sqlite3 = require('sqlite3').verbose();

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

class SQLiteDatabase {
  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.create();
    this.addBet(fakeBet);
    this.getBets();
  }

  create() {
    this.db.serialize(() => {
      this.db.run('CREATE TABLE bets (strategy TEXT, marketId TEXT, size INT, price TEXT, side TEXT, betId TEXT, rfs TEXT, trailing BOOLEAN, hedged BOOLEAN, assignedIsOrderMatched BOOLEAN, tickOffset INT, units TEXT, percentageTrigger INT, executionTime TEXT, timeOffset INT, seconds INT, startTime INT, targetLTP INT, stopEntryCondition TEXT)');
    });
  }

  async addBet(bet) {
    const {
      strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition,
    } = bet;
    const stmt = this.db.prepare('INSERT INTO bets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition);
    stmt.finalize();
  }

  updateBet() {
  }

  removeBet() {
  }

  async getBets() {
    const rows = [];
    await this.db.each('SELECT strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition FROM bets', function(err, row) {
      rows.push(row);
      console.log(row);
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = new SQLiteDatabase();
