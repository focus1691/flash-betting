const stopEntryCheck = async (currentLTP, stopEntryArray, onPlaceOrder, unmatchedBets, matchedBets, testing = false) => {
  let indexesToRemove = [];
  let ordersToRemove = [];

  // eslint-disable-next-line no-loop-func
  stopEntryArray.map((item, index) => {
    if ((currentLTP < item.targetLTP && item.stopEntryCondition === '<')
    || (currentLTP == item.targetLTP && item.stopEntryCondition === '=')
    || (currentLTP > item.targetLTP && item.stopEntryCondition === '>')) {
      onPlaceOrder({ ...item, unmatchedBets, matchedBets });

      indexesToRemove = indexesToRemove.concat(index);
      ordersToRemove = ordersToRemove.concat(item);
    }
  });
  if (ordersToRemove.length > 0) {
    if (!testing) {
      await fetch('/api/remove-orders', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(ordersToRemove),
      });
    }
  }

  return indexesToRemove;
};

export { stopEntryCheck };
