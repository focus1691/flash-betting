export const stopEntryCheck = async (currentLTP, stopEntryArray, onPlaceOrder, unmatchedBets, matchedBets) => {
  let indexesToRemove = [];
  let ordersToRemove = [];

  // eslint-disable-next-line no-loop-func
  stopEntryArray.map((item, index) => {
    if ((currentLTP < item.targetLTP && item.stopEntryCondition === '<') || (currentLTP == item.targetLTP && item.stopEntryCondition === '=') || (currentLTP > item.targetLTP && item.stopEntryCondition === '>')) {
      onPlaceOrder({ ...item, unmatchedBets, matchedBets });

      indexesToRemove = indexesToRemove.concat(index);
      ordersToRemove = ordersToRemove.concat(item);
    }
  });
  if (ordersToRemove.length > 0) {
    await fetch('/api/remove-bet', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(ordersToRemove),
    });
  }

  return indexesToRemove;
};

export const stopEntryListChange = async (stopEntryList, selectionId, currentLTP, onPlaceOrder, previousNewStopEntryList, unmatchedBets, matchedBets) => {
  const stopEntryArray = stopEntryList[selectionId];
  const newStopEntryList = { ...previousNewStopEntryList };

  if (stopEntryArray !== undefined) {
    try {
      const indexesToRemove = await stopEntryCheck(currentLTP, stopEntryArray, onPlaceOrder, unmatchedBets, matchedBets);
      // if the array length has some items left, then keep it
      if (stopEntryArray.length > indexesToRemove.length) {
        newStopEntryList[selectionId] = stopEntryArray.filter((item, index) => indexesToRemove.indexOf(index) === -1);
      } else {
        delete newStopEntryList[selectionId];
      }
    } catch (e) {}
  }

  return newStopEntryList;
};
