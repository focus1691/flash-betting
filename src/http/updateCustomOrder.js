/**
 * @param {string} endpoint - Endpoint for SQLite DB to update an order
 * @param {Object} data     - Bet object containing info about the bet (rfs, selectionId, marketId, side)  
 */
export default async (endpoint, data) => {
  fetch(`/api/${endpoint}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAllBets = async (marketId) => {
  const bets = await fetch(`/api/get-all-bets?marketId=${encodeURIComponent(marketId)}`)
    .then((res) => res.json());
  return bets;
};
