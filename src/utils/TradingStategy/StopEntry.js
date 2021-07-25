import { isEmpty } from 'lodash';

export const checkStopEntryTargetMet = (stopEntryList, currentLTP) => {
  const betsToRemove = [];
  if (isEmpty(stopEntryList)) return betsToRemove;

  for (let i = 0; i < stopEntryList.length; i += 1) {
    const { targetLTP, stopEntryCondition } = stopEntryList[i];
    if ((currentLTP < targetLTP && stopEntryCondition === '<') || (currentLTP == targetLTP && stopEntryCondition === '=') || (currentLTP > targetLTP && stopEntryCondition === '>')) {
      betsToRemove.push(stopEntryList[i]);
    }
  }
  return betsToRemove;
};

export const extractStopEntryRfs = (bets) => {
  if (Array.isArray(bets)) {
    return bets.map(({ rfs }) => rfs);
  }
  return [];
};
