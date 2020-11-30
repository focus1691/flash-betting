export const saveBet = (bet) => {
  fetch('/api/save-bet', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(ordbeter),
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

export const updatePrice = (bet) => {
  fetch('/api/update-price', {
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

export const replaceOrders = async (marketId, betId, newPrice) => {
  const result = await fetch('/api/replace-orders', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      marketId,
      betId,
      newPrice,
    }),
  })
  .then((res) => res.json())
  return result;
}

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
