import _ from 'lodash';

export const checkStopEntryTargetMet = (stopEntryList, selectionId, currentLTP) => {
  const betsToRemove = [];
  if (_.isEmpty(stopEntryList) || _.isEmpty(stopEntryList[selectionId])) return betsToRemove;

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
