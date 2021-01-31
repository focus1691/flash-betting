import _ from 'lodash';
//* Utils
import { twoDecimalPlaces } from '../Bets/BettingCalculations';

export const getProfitAndLoss = (bets) => {
  const groupedBets = _.groupBy(_.orderBy(bets, 'desc'), 'settledDate', 'settledDate');

  const collectionWithKey = _.map(groupedBets, (item, key) => ({...item, _key: key}) )
  const sortedCollectionWithKey =  _.sortBy(collectionWithKey, ['settledDate']) //   
  console.log(sortedCollectionWithKey);
  const keys = Object.keys(groupedBets);
  let cumulativeTotal = 0;
  const data = [];

  for (let i = 0; i < keys.length; i += 1) {
    for (let j = 0; j < groupedBets[keys[i]].length; j += 1) {
      cumulativeTotal += Number(groupedBets[keys[i]][j].profit);
    }
    data.push({ time: keys[i], value: twoDecimalPlaces(cumulativeTotal) });
  }
  console.table(data);
  return data;
};
