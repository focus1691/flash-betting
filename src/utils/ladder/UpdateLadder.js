import { calcBackLayPercentages } from './CreateLadder';
import { formatPriceKey } from '../Bets/PriceCalculations';
import { sortAsc } from '../Sort';

export const constructNonRunnersObj = (nonRunners) => {
  const nonRunnersObj = {};
  for (let i = 0; i < nonRunners.length; i += 1) {
    const data = nonRunners[i];
    const { id } = data;
    nonRunnersObj[id] = data;
  }
  return nonRunnersObj;
};

export const UpdateLadder = (ladder, rawData) => {
  const newLadder = { ...ladder };

  newLadder.expanded = Boolean(newLadder.expanded);

  // The last traded price goes to the front of the array
  if (rawData.ltp) {
    newLadder.ltp = [rawData.ltp, ...newLadder.ltp];
  }

  // Update the trade volume
  // ? Why is the trade volume an array. Simplify to number?
  if (rawData.tv) {
    newLadder.tv = [rawData.tv, newLadder.tv[0]];
  }

  if (rawData.trd) {
    for (let i = 0; i < rawData.trd.length; i += 1) {
      const trd = rawData.trd[i];
      if (trd) {
        const [price, volumeMatched] = trd;
        const index = newLadder.trd.map((trd) => trd[0]).findIndex((val) => val === price);

        if (volumeMatched >= 100) {
          newLadder.trdo[formatPriceKey(price)] = volumeMatched;
          if (index === -1) newLadder.trd.push([price, volumeMatched]);
          else newLadder.trd[index][1] = volumeMatched;
        }
        else if (volumeMatched < 100) {
          delete newLadder.trdo[formatPriceKey(price)];
          if (index > -1) newLadder.trd.splice(index, 1);
        }
      }
    }
  }

  if (rawData.atb) {
    for (let i = 0; i < rawData.atb.length; i += 1) {
      if (rawData.atb[i]) {
        const [price, matched] = rawData.atb[i];
        const key = formatPriceKey(price);

        // 1) Remove the price as 0 means no more matched bets at this AVAILABLE TO BACK price
        if (matched <= 0) {
          delete newLadder.atlo[key];
        }
        else if (ladder.atbo[key]) {
          let difference = ladder.atbo[key] - matched;

          if (difference <= 0) {
            difference = Math.abs(difference);

            delete newLadder.atbo[key];
            newLadder.atlo[key] = difference;
          }
          else {
            delete newLadder.atlo[key];
            newLadder.atbo[key] = difference;
          }
        }
        else {
          newLadder.atlo[key] = matched;
        }
      }
    }
  }

  if (rawData.atl) {
    for (let i = 0; i < rawData.atl.length; i += 1) {
      if (rawData.atl[i]) {
        const [price, matched] = rawData.atl[i];
        const key = formatPriceKey(price);

        // 1) Remove the price as 0 means no more matched bets at this AVAILABLE TO BACK price
        if (matched <= 0) {
          delete newLadder.atbo[key];
        }
        else if (ladder.atlo[key]) {
          let difference = ladder.atlo[key] - matched;

          if (difference <= 0) {
            difference = Math.abs(difference);

            delete newLadder.atlo[key];
            newLadder.atbo[key] = difference;
          }
          else {
            delete newLadder.atbo[key];
            newLadder.atlo[key] = difference;
          }
        }
        else {
          newLadder.atbo[key] = matched;
        }
      }
    }
  }

  const LTP = newLadder.ltp[0];

  sortAsc(newLadder.trd);

  newLadder.percent = calcBackLayPercentages(newLadder.atbo, newLadder.atlo, LTP);

  return newLadder;
}
