export const fetchData = async (endpoint, ) => {

  const { result, error } = await fetch(endpoint);

  if (error) {
    window.location.href = `${window.location.origin}/?error=INVALID_SESSION_INFORMATION`;
  }
  else if (result) {
    
  }

  const bets = await fetch(`/api/listCurrentOrders?marketId=${marketId}`)
  .then((res) => res.json())
  .then((res) => res.currentOrders);
  return bets;
};
