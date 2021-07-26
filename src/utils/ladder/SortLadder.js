export const sortLadder = (ladders) => {
  Object.keys(ladders)
    .map((selectionId) => [ladders[selectionId].ltp[0], selectionId])
    .sort((a, b) => !a[0] - !b[0] || a[0] - b[0])
    .map((data) => data[1]);
};

export const sortGreyHoundMarket = (sportId, runners) => {
  if (sportId === '4339') {
    return Object.keys(runners)
      .map((key) => [runners[key].runnerName, key])
      .sort()
      .map((val) => val[1]);
  }
  return [];
};

export const sortLadders = (eventTypeId, ladders, sortedLadder, updateLadderOrder, setSortedLadder, updateExcludedLadders, excludeLadders) => {
  if (eventTypeId === '4339') {
    //! Used to track ladder bet when dragging & dropping ladders
    const newOrderList = {};
    for (let j = 0; j < sortedLadder.length; j += 1) {
      newOrderList[j] = sortedLadder[j];
    }
    updateLadderOrder(newOrderList);
  } else {
    const sortedLadderIndices = sortLadder(ladders);
    setSortedLadder(sortedLadderIndices);

    if (excludeLadders) {
      updateExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));
    }

    //! Used to track ladder bet when dragging & dropping ladders
    const newOrderList = {};
    for (let j = 0; j < sortedLadderIndices.length; j += 1) {
      newOrderList[j] = sortedLadderIndices[j];
    }
    updateLadderOrder(newOrderList);
  }
};

export const sortLaddersByLTP = (eventTypeId, ladders, updateLadderOrder, setSortedLadder, updateExcludedLadders) => {
  if (eventTypeId !== '4339') {
    const sortedLadderIndices = sortLadder(ladders);
    setSortedLadder(sortedLadderIndices);
    updateExcludedLadders(sortedLadderIndices);
    const newOrderList = {};
    for (let j = 0; j < sortedLadderIndices.length; j += 1) {
      newOrderList[j] = sortedLadderIndices[j];
    }
    updateLadderOrder(newOrderList);
  }
};
