const getTotalMatched = (betPending, stake, cellMatched, cellUnmatched) => {
  let totalMatched = 0;

  if (betPending) totalMatched += stake;
  if (cellMatched.matched) totalMatched += cellMatched.matched;
  if (cellUnmatched) {
    totalMatched += cellUnmatched.reduce((acc, bet) => parseFloat(acc) + parseFloat(bet.size), 0);
  }
  return totalMatched;
};

const orderStyle = (side, stopLoss, tickOffset, cellMatched, totalMatched, pendingBets) => {
  if (pendingBets) return { background: 'red' };
  if (stopLoss) return { background: 'yellow' };
  if (tickOffset) return { background: 'yellow' };
  if (cellMatched.side === 'BACK' && totalMatched > 0 && side) return { background: '#75C2FD' };
  if (cellMatched.side === 'LAY' && totalMatched > 0 && side === 'LAY') return { background: '#F694AA' };
  if (side === 'LAY') return { background: '#eba8a6' };
  if (side === 'BACK') return { background: '#BCE4FC' };
  return null;
};

const textForOrderCell = (stopLoss, totalMatched) => {
  if (stopLoss && stopLoss.stopLoss) { // stop loss on cell
    if (stopLoss.stopLoss.hedged) return 'H';
    return stopLoss.stopLoss.size;
  }
  if (totalMatched > 0) {
    return totalMatched;
  }
  return null;
};

const isOrderPending = (price, bets) => {
  const pending = { BACK: false, LAY: false };
  for (let i = 0; i < bets.length; i++) {
    if (bets[i].delayed && parseInt(bets[i].price) === parseInt(price)) {
      if (bets[i].side === 'BACK') pending.BACK = true;
      else if (bets[i].side === 'LAY') pending.LAY = true;
    }
  }
  return pending;
};

const getMatchedSide = (firstCol) => ({
  left: firstCol ? 'LAY' : 'BACK',
  right: firstCol ? 'BACK' : 'LAY',
});

export {
  getTotalMatched, textForOrderCell, orderStyle, getMatchedSide, isOrderPending,
};
