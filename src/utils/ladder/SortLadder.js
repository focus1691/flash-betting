import { isEmpty } from 'lodash';

export const sortLadder = (ladders) => {
  if (isEmpty(ladders)) return [];

  return Object.keys(ladders)
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

export const isGreyHoundRace = (eventTypeId) => {
  return eventTypeId === '4339';
};

export const sortLadders = (eventTypeId, ladders, updateLadderOrder, setSortedLadder) => {
  if (!isGreyHoundRace(eventTypeId)) {
    const sortedLadder = sortLadder(ladders);
    setSortedLadder(sortedLadder);

    updateLadderOrder({ ...sortedLadder });
  }
};
