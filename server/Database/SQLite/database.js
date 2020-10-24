const sqlite3 = require('sqlite3').verbose();

class SQLiteDatabase {
  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.create();
    this.getBets();
  }

  create() {
    this.db.serialize(() => {
      // eslint-disable-next-line max-len
      this.db.run('CREATE TABLE bets (strategy TEXT, marketId TEXT, size INT, price TEXT, side TEXT, betId TEXT, rfs TEXT, trailing BOOLEAN, hedged BOOLEAN, assignedIsOrderMatched BOOLEAN, tickOffset INT, units TEXT, percentageTrigger INT, executionTime TEXT, timeOffset INT, seconds INT, startTime INT, targetLTP INT, stopEntryCondition TEXT)');
      const stmt = this.db.prepare('INSERT INTO bets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
      for (let i = 0; i < 10; i += 1) {
        stmt.run('BACK', '1.232323', 2, '2.02', 'BACK', '23232232', '142124124sdffs', false, false, false, null, null, null, null, null, null, null, null);
      }
      stmt.finalize();
      console.log('1');
    });
  }
  addBet() {

  }

  updateBet() {

  }
  
  removeBet() {
    
  }

  getBets() {
    this.db.each('SELECT strategy, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, units, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition FROM bets', (err, row) => {
      console.log(row);
    });
    console.log('2');
  }
  close() {
    this.db.close();
  }
}

module.exports = new SQLiteDatabase();
