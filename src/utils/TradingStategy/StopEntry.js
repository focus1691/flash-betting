import { isEmpty } from 'lodash';

export const checkStopEntryTargetMet = (stopEntryList, selectionId, currentLTP) => {
  const betsToRemove = [];
  if (isEmpty(stopEntryList) || isEmpty(stopEntryList[selectionId])) return betsToRemove;

  for (let i = 0; i < stopEntryList[selectionId].length; i += 1) {
    const { targetLTP, stopEntryCondition } = stopEntryList[selectionId][i];
    if ((currentLTP < targetLTP && stopEntryCondition === '<') || (currentLTP == targetLTP && stopEntryCondition === '=') || (currentLTP > targetLTP && stopEntryCondition === '>')) {
      betsToRemove.push(stopEntryList[selectionId][i]);
    }
  }
  return betsToRemove;
};

export const extractStopEntryRfs = (bets) => {
  return bets.map(({ rfs }) => rfs);
};

export const checkAndExecuteStopEntry = (stopEntryList, id, currentLTP, placeStopEntryBet) => {
  const stopEntryBetsToRemove = checkStopEntryTargetMet(stopEntryList, id, currentLTP);
  if (!isEmpty(stopEntryBetsToRemove)) placeStopEntryBet({ stopEntryBetsToRemove });
};
