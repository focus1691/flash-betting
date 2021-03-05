const SQLiteDatabase = require('../../server/sqlite/database');

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
  marketId: '1.232323',
  size: 50,
  price: '5.5',
  side: 'LAY',
  betId: '555555555',
  rfs: '1vsdfsfds5345',
  ticks: 2,
  trailing: false,
  hedged: false,
  assignedIsOrderMatched: false,
};

describe('Add new bet', () => {
  it('should insert a new bet', async () => {
    await SQLiteDatabase.setup();
    await SQLiteDatabase.addBet(fakeBet);
    await SQLiteDatabase.addBet(fakeBet2);

    const bets = await SQLiteDatabase.getBets(fakeBet.marketId);

    expect(bets).toHaveLength(2);
  });
});

describe('update bets', () => {
  let updatedFakeBet2;
  it('should update ticks', async () => {
    await SQLiteDatabase.setup();
    await SQLiteDatabase.addBet(fakeBet2);

    fakeBet2.ticks += 1;
    await SQLiteDatabase.updateTicks(fakeBet2);
    updatedFakeBet2 = await SQLiteDatabase.getBet(fakeBet2.rfs);

    expect(updatedFakeBet2.ticks).toEqual(3);
  });

  it('should update bet matched', async () => {
    await SQLiteDatabase.setup();
    await SQLiteDatabase.addBet(fakeBet2);

    fakeBet2.assignedIsOrderMatched = true;
    await SQLiteDatabase.updateOrderMatched(fakeBet2);
    updatedFakeBet2 = await SQLiteDatabase.getBet(fakeBet2.rfs);

    expect(updatedFakeBet2.assignedIsOrderMatched).toBeTruthy();
  });

  it('should update the price', async () => {
    await SQLiteDatabase.setup();
    await SQLiteDatabase.addBet(fakeBet2);

    fakeBet2.price = 55;
    await SQLiteDatabase.updatePrice(fakeBet2);
    updatedFakeBet2 = await SQLiteDatabase.getBet(fakeBet2.rfs);

    expect(updatedFakeBet2.price).toEqual('55');
  });

  it('should remove the bet', async () => {
    await SQLiteDatabase.setup();
    await SQLiteDatabase.addBet(fakeBet);
    await SQLiteDatabase.addBet(fakeBet2);


    await SQLiteDatabase.removeBet(fakeBet2);

    const bets = await SQLiteDatabase.getBets('1.232323');
    
    expect(bets).toHaveLength(1);
  });
});
