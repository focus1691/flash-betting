/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import moment from 'moment';
//* Utils
import { twoDecimalPlaces } from './BettingCalculations';

const getDate = (timeFrame) => {
  if (timeFrame === '1D') return moment(moment()).subtract(1, 'days');
  if (timeFrame === '1W') return moment(moment()).subtract(1, 'weeks');
  if (timeFrame === '1M') return moment(moment()).subtract(1, 'months');
  if (timeFrame === '3M') return moment(moment()).subtract(3, 'months');
  if (timeFrame === 'ALL') return moment(moment()).subtract(10, 'years');

  return moment(moment()).subtract(10, 'years');
}

export default (bets, timeFrame) => {
  const timeLimit = getDate(timeFrame);

  bets = bets.filter((bet) => moment(bet.settledDate) >= timeLimit);

  const groupedBets = _.groupBy(_.orderBy(bets, 'desc'), 'groupDate', 'settledDate');
  const dates = Object.keys(groupedBets).sort((a, b) => moment(a) - moment(b));
  let cumulativeTotal = 0;
  const data = [];

  for (let i = 0; i < dates.length; i += 1) {
    for (let j = 0; j < groupedBets[dates[i]].length; j += 1) {
      cumulativeTotal += Number(groupedBets[dates[i]][j].profit);
    }
    data.push({ time: dates[i], value: twoDecimalPlaces(cumulativeTotal) });
  }
  return data;
};
