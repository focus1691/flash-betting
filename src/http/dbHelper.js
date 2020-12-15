export const saveBet = (bet) => {
  fetch('/api/save-bet', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(bet),
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

export const getAllBets = async (marketId) => {
  const bets = await fetch(`/api/get-all-bets?marketId=${encodeURIComponent(marketId)}`)
    .then((res) => res.json());
  return bets;
};
