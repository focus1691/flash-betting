/**
 * @param {string} endpoint - Endpoint for SQLite DB to update an order
 * @param {Object} data     - Bet object containing info about the bet (rfs, selectionId, marketId, side)  
 */
export default async (endpoint, data) => {
  try {
    await fetch(`/api/${endpoint}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.log(`Error: updating custom order ${error}`);
  }
};

export const getAllBets = async (marketId) => {
  try {
    const bets = await fetch(`/api/get-all-bets?marketId=${encodeURIComponent(marketId)}`)
      .then((res) => res.json());
    return bets;
  } catch (error) {
    console.log(`Error: retrieving all bets ${error}`);
    return null;
  }
};
