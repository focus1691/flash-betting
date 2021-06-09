import _ from 'lodash';
import { removeBet } from '../../http/dbHelper';

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

export const checkAndExecuteStopEntry = (stopEntryList, id, currentLTP, placeOrder, removeMultiSelectionStopEntryBets) => {
  // stop Entry
  const stopEntryBetsToRemove = checkStopEntryTargetMet(stopEntryList, id, currentLTP);
  if (!_.isEmpty(stopEntryBetsToRemove)) {
    for (let i = 0; i < stopEntryBetsToRemove.length; i += 1) {
      const { rfs, marketId, selectionId, side, size, price } = stopEntryBetsToRemove[i];
      const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

      placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef });
      removeBet({ rfs }); // Remove from database
    }
    removeMultiSelectionStopEntryBets(extractStopEntryRfs(stopEntryBetsToRemove));
  }
};
