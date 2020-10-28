const SQLiteDatabase = require('../../server/Database/SQLite/database');

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

describe('insert', () => {
  it('should insert a new bet', async () => {
    await SQLiteDatabase.setup();
    await SQLiteDatabase.addBet(fakeBet);
    await SQLiteDatabase.addBet(fakeBet2);

    const bets = await SQLiteDatabase.getBets();

    expect(bets).toHaveLength(2);
  });
});
