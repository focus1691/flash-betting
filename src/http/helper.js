export const saveBet = (order) => {
  fetch('/api/save-bet', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(order),
  });
};

export const removeBet = (bet) => {
  fetch('/api/remove-bet', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  });
};

export const updateTicks = (bet) => {
  fetch('/api/update-ticks', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  });
};

export const updateOrderMatched = (bet) => {
  fetch('/api/update-bet-matched', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  });
};

export const updateStoredStopLoss = (bet) => {
  fetch('/api/update-stop-loss', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
  });
};

export const getBetFairBets = async (marketId) => {
  const bets = await fetch(`/api/listCurrentOrders?marketId=${marketId}`)
  .then((res) => res.json())
  .then((res) => res.currentOrders);
  return bets;
};

export const saveRunnerNames = async (marketId, selectionNames) => {
  fetch('/api/save-runner-names', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      marketId,
      selectionNames,
    }),
  });
};
