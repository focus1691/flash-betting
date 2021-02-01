/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import moment from 'moment';
//* Utils
import { twoDecimalPlaces } from '../Bets/BettingCalculations';

export const getProfitAndLoss = (bets) => {
  const groupedBets = _.groupBy(_.orderBy(bets, 'desc'), 'settledDate', 'settledDate');
  const dates = Object.keys(groupedBets).map((date) => moment(date)).sort((a, b) => a - b);
  let cumulativeTotal = 0;
  const data = [];

  for (let i = 0; i < dates.length; i += 1) {
    for (let j = 0; j < groupedBets[dates[i]._i].length; j += 1) {
      cumulativeTotal += Number(groupedBets[dates[i]._i][j].profit);
    }
    data.push({ time: dates[i]._i, value: twoDecimalPlaces(cumulativeTotal) });
  }
  return data;
};
