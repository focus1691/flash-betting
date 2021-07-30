/* eslint-disable max-len */
const Database = require('sqlite-async');

class SQLiteDatabase {
  async setup() {
    this.db = await Database.open(':memory:').then(async (db) => db);
    await this.db.run(
      'CREATE TABLE bets (strategy TEXT, selectionId TEXT, marketId TEXT, size INT, price TEXT, side TEXT, betId TEXT, rfs TEXT, trailing BOOLEAN, hedged BOOLEAN, assignedIsOrderMatched BOOLEAN, tickOffset INT, custom BOOLEAN, units TEXT, ticks INT, percentageTrigger INT, executionTime TEXT, timeOffset INT, seconds INT, startTime INT, targetLTP INT, stopEntryCondition TEXT)',
    );
  }

  async addBet(bet) {
    const {
      strategy, selectionId, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, custom, units, ticks, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition,
    } = bet;
    const stmt = await this.db.prepare('INSERT INTO bets VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    await stmt.run(strategy, selectionId, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, custom, units, ticks, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition);
    await stmt.finalize();
  }

  async getBet(rfs) {
    const stmt = await this.db.prepare('SELECT * FROM bets WHERE rfs = ?');
    const bet = await stmt.get(rfs);
    return bet;
  }

  async getBets(marketId) {
    const rows = [];
    await this.db.each(
      `SELECT strategy, selectionId, marketId, size, price, side, betId, rfs, trailing, hedged, assignedIsOrderMatched, tickOffset, custom, units, ticks, percentageTrigger, executionTime, timeOffset, seconds, startTime, targetLTP, stopEntryCondition FROM bets WHERE marketId = ${marketId}`,
      (err, row) => {
        rows.push(row);
      },
    );
    return rows;
  }

  async updatePrice(bet) {
    const {
      rfs, price,
    } = bet;
    const stmt = await this.db.prepare('UPDATE bets SET price = (?) WHERE rfs = (?)');
    await stmt.run(price, rfs);
    await stmt.finalize();
  }

  async updateTicks(bet) {
    const {
      rfs, ticks,
    } = bet;
    const stmt = await this.db.prepare('UPDATE bets SET ticks = (?) WHERE rfs = (?)');
    await stmt.run(ticks, rfs);
    await stmt.finalize();
  }

  async updateOrderMatched(bet) {
    const {
      rfs, assignedIsOrderMatched,
    } = bet;
    const stmt = await this.db.prepare('UPDATE bets SET assignedIsOrderMatched = (?) WHERE rfs = (?)');
    await stmt.run(assignedIsOrderMatched, rfs);
    await stmt.finalize();
  }

  async updateStopLoss(bet) {
    const {
      rfs, size, price, units, custom, assignedIsOrderMatched, tickOffset, hedged,
    } = bet;
    const stmt = await this.db.prepare('UPDATE bets SET size = (?), price = (?), units = (?), custom = (?), assignedIsOrderMatched = (?), tickOffset = (?), hedged = (?)  WHERE rfs = (?)');
    await stmt.run(size, price, units, custom, assignedIsOrderMatched, tickOffset, hedged, rfs);
    await stmt.finalize();
  }

  async removeBet(bet) {
    const { rfs } = bet;
    const stmt = await this.db.prepare('DELETE FROM bets WHERE rfs = (?)');
    await stmt.run(rfs);
    await stmt.finalize();
  }

  async removeSelectionBets(bet) {
    const { selectionId } = bet;
    const stmt = await this.db.prepare('DELETE FROM bets WHERE selectionId = (?)');
    await stmt.run(selectionId);
    await stmt.finalize();
  }

  async removeSelectionBetsOnSide(bet) {
    const { selectionId, side } = bet;
    const stmt = await this.db.prepare('DELETE FROM bets WHERE selectionId = (?), side = (?)');
    await stmt.run(selectionId, side);
    await stmt.finalize();
  }

  async removeAllBets(bet) {
    const { marketId } = bet;
    const stmt = await this.db.prepare('DELETE FROM bets WHERE marketId = (?)');
    await stmt.run(marketId);
    await stmt.finalize();
  }

  close() {
    this.db.close();
  }
}

module.exports = new SQLiteDatabase();
