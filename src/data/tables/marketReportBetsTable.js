import { isEmpty } from 'lodash';
import moment from 'moment';

export const columns = [
  { id: 'placedDate', label: 'Placed' },
  { id: 'selection', label: 'Selection' },
  { id: 'averagePriceMatched', label: 'Odds' },
  { id: 'sizeMatched', label: 'Stake / (Liability)' },
  { id: 'win', label: 'Status' },
];

export const createRows = (runners, runnerResults, matchedBets) => {
  const rows = Object.values(matchedBets).map(({ selectionId, placedDate, sizeMatched, price, }) => {
    const result = runnerResults.find((runner) => runner.selectionId == selectionId);
    const win = isEmpty(result) ? false : result.status === 'WINNER';
    return {
      placedDate: moment(placedDate).calendar(),
      Selection: runners[selectionId] ? runners[selectionId].runnerName : selectionId,
      averagePriceMatched: price,
      sizeMatched,
      win,
    }
  });

  return rows;
};
