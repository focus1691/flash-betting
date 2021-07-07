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
  if (cellMatched.side === 'BACK' && totalMatched > 0 && side) return { background: '#0a5271' };
  if (cellMatched.side === 'LAY' && totalMatched > 0 && side === 'LAY') return { background: '#d4696b' };
  if (side === 'LAY') return { background: '#eba8a6' };
  if (side === 'BACK') return { background: '#007aaf' };
  return null;
};

const textForOrderCell = (stopLoss, totalMatched) => {
  // The matched amount much be an integer, so remove any pence to the amount, e.g. £2.57 -> £2.00 (2.57 -> 2)
  totalMatched = Math.floor(totalMatched);
  if (stopLoss) {
    const { hedged, size } = stopLoss;
    if (hedged) return 'H';
    return size;
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
