import { calcBackLayPercentages } from './CreateLadder';
import { formatPriceKey } from '../Bets/PriceCalculations';
import { sortAsc, sortDes } from '../Sort';

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

        // 1) Remove the price as 0 means no more matched bets at this AVAILABLE TO BACK price
        if (matched <= 0) {
          newLadder.atb = newLadder.atb.filter((v) => v[0] !== price);
          delete newLadder.atlo[formatPriceKey(price)];
        }
        else {
          const atlIdx = newLadder.atl.findIndex((v) => v[0] === price);
          const atbIdx = newLadder.atb.findIndex((v) => v[0] === price);

          if (atlIdx > -1) {
            let difference = newLadder.atl[atlIdx][1] - matched;

            if (difference <= 0) {
              difference = Math.abs(difference);
              newLadder.atl = newLadder.atl.filter((v) => v[0] !== price);
              delete newLadder.atbo[formatPriceKey(price)];

              if (atbIdx > -1) {
                newLadder.atb[atbIdx][1] = difference;
              } else {
                newLadder.atb.push([price, difference]);
              }
              
              newLadder.atlo[formatPriceKey(price)] = difference;
            }
            else {
              newLadder.atb = newLadder.atb.filter((v) => v[0] !== price);
              delete newLadder.atlo[formatPriceKey(price)];

              newLadder.atl[atlIdx][1] = difference;
              newLadder.atbo[formatPriceKey(price)] = difference;
            }
          }

          // 2) Price exists already, so we just update the matched amount
          else if (atbIdx > -1) {
            newLadder.atb[atbIdx][1] = matched;
            newLadder.atlo[formatPriceKey(price)] = matched;
          }
          // 3) The price doesn't exist as AVAILABLE TO BACK, so we add it
          else {
            newLadder.atb.push([price, matched]);
            newLadder.atlo[formatPriceKey(price)] = matched;
          }
        }
      }
    }
  }

  if (rawData.atl) {
    for (let i = 0; i < rawData.atl.length; i += 1) {
      if (rawData.atl[i]) {
        const [price, matched] = rawData.atl[i];

        // 1) Remove the price as 0 means no more matched bets at this AVAILABLE TO LAY price
        if (matched <= 0) {
          newLadder.atl = newLadder.atl.filter((v) => v[0] !== price);
          delete newLadder.atbo[formatPriceKey(price)];
        }
        else {
          const atlIdx = newLadder.atl.findIndex((v) => v[0] === price);
          const atbIdx = newLadder.atb.findIndex((v) => v[0] === price);

          if (atbIdx > -1) {
            let difference = newLadder.atb[atbIdx][1] - matched;

            if (difference <= 0) {
              difference = Math.abs(difference);
              newLadder.atb = newLadder.atb.filter((v) => v[0] !== price);
              delete newLadder.atlo[formatPriceKey(price)];

              if (atlIdx > -1) {
                newLadder.atl[atlIdx][1] = difference;
              }
              else {
                newLadder.atl.push([price, difference]);
              }

              newLadder.atbo[formatPriceKey(price)] = difference;
            }
            else {
              newLadder.atl = newLadder.atl.filter((v) => v[0] !== price);
              delete newLadder.atbo[formatPriceKey(price)];

              newLadder.atb[atbIdx][1] = difference;
              newLadder.atlo[formatPriceKey(price)] = difference;
            }
          }

          // 2) Price exists already, so we just update the matched amount
          if (atlIdx > -1) {
            newLadder.atl[atlIdx][1] = matched;
            newLadder.atbo[formatPriceKey(price)] = matched;
          }
          // 3) The price doesn't exist as AVAILABLE TO LAY, so we add it
          else {
            newLadder.atl.push([price, matched]);
            newLadder.atbo[formatPriceKey(price)] = matched;
          }
        }
      }
    }
  }

  const LTP = newLadder.ltp[0];

  // REMOVE AVAILABLE TO BACK prices that are ABOVE the last traded price
  // newLadder.atb = newLadder.atb.filter(([price]) => {
  //   if (LTP && price > LTP) {
  //     delete newLadder.atlo[formatPriceKey(price)];
  //     return false;
  //   }
  //   return true;
  // });

  // // REMOVE AVAILABLE TO LAY prices that are BELOW the last traded price
  // newLadder.atl = newLadder.atl.filter(([price]) => {
  //   if (LTP && price < LTP) {
  //     delete newLadder.atbo[formatPriceKey(price)];
  //     return false;
  //   }
  //   return true;
  // });

  sortAsc(newLadder.trd);
  // sortAsc(newLadder.atl);
  // sortDes(newLadder.atb);

  newLadder.percent = calcBackLayPercentages(newLadder.atbo, newLadder.atlo, LTP);

  return newLadder;
};

