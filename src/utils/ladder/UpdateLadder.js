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
  const newLadder = Object.assign(ladder, {});

  newLadder.expanded = Boolean(newLadder.expanded);

  // The last traded price goes to the front of the array
  if (rawData.ltp) {
    newLadder.ltp = [rawData.ltp, ...newLadder.ltp];
    newLadder.ltpDelta = new Date();
  }

  // Update the trade volume
  // ? Why is the trade volume an array. Simplify to number?
  if (rawData.tv) {
    newLadder.tv = [rawData.tv, newLadder.tv[0]];
  }

  if (rawData.trd) {
    for (let i = 0; i < rawData.trd.length; i += 1) {
      if (rawData.trd[i]) {
        const price = rawData.trd[i][0];
        const volumeMatched = Math.floor(rawData.trd[i][1]);
        const index = newLadder.trd.map((trd) => trd[0]).findIndex((val) => val === price);

        if (volumeMatched >= 100) {
          newLadder.trdo[formatPriceKey(price)] = volumeMatched;
          if (index === -1) newLadder.trd.push([price, volumeMatched]);
          else newLadder.trd[index][1] = volumeMatched;
        } else if (volumeMatched < 100) {
          delete newLadder.trdo[formatPriceKey(price)];
          if (index > -1) newLadder.trd.splice(index, 1);
        }
      }
    }
  }

  if (rawData.atb) {
    for (let i = 0; i < rawData.atb.length; i += 1) {
      if (rawData.atb[i]) {
        const price = rawData.atb[i][0];
        const matched = Math.floor(rawData.atb[i][1]);

        if (matched <= 0) {
          newLadder.atb = newLadder.atb.filter((v) => v[0] !== price);
          delete newLadder.atlo[formatPriceKey(price)];
        } else {
          const atbIdx = newLadder.atb.findIndex((v) => v[0] === price);
          // const atlIdx = newLadder.atl.findIndex((v) => v[0] === price);

          // price exists already in available to lay
          // if (atlIdx > -1) {
          //   if (matched > newLadder.atb[atlIdx][1]) {
          //     newLadder.atl = newLadder.atl.filter((v) => v[0] !== price);
          //     delete newLadder.atbo[formatPriceKey(price)];
          //   } else if (matched > newLadder.atl[atlIdx][1]) {
          //     newLadder.atb = newLadder.atb.filter((v) => v[0] !== price);
          //     delete newLadder.atlo[formatPriceKey(price)];
          //   }
          // }
          // price exists in available to back
          // else
          if (atbIdx > -1) {
            newLadder.atb[atbIdx][1] = matched;
            newLadder.atlo[formatPriceKey(price)] = matched;
          }
          // The price doesn't exist as available to back
          else {
            newLadder.atb.push([price, matched]);
            newLadder.atlo[formatPriceKey(price)] = matched;
          }
        }
        // newLadder.atl = newLadder.atl.filter(([atlPrice]) => {
        //   if (atlPrice <= price || (newLadder.ltp[0] && atlPrice < newLadder.ltp[0])) {
        //     delete newLadder.atbo[formatPriceKey(atlPrice)];
        //     return false;
        //   }
        //   return true;
        // });
      }
    }
  }

  if (rawData.atl) {
    for (let i = 0; i < rawData.atl.length; i += 1) {
      if (rawData.atl[i]) {
        const price = rawData.atl[i][0];
        const matched = Math.floor(rawData.atl[i][1]);

        if (matched <= 0) {
          newLadder.atl = newLadder.atl.filter((v) => v[0] !== price);
          delete newLadder.atbo[formatPriceKey(price)];
        } else {
          const atlIdx = newLadder.atl.findIndex((v) => v[0] === price);
          // const atbIdx = newLadder.atb.findIndex((v) => v[0] === price);

          // if (atbIdx > -1) {
          //   if (matched > newLadder.atb[atbIdx][1]) {
          //     newLadder.atb = newLadder.atb.filter((v) => v[0] !== price);
          //     delete newLadder.atlo[formatPriceKey(price)];
          //   } else if (matched > newLadder.atb[atbIdx][1]) {
          //     newLadder.atl = newLadder.atl.filter((v) => v[0] !== price);
          //     delete newLadder.atbo[formatPriceKey(price)];
          //   }
          // } else
          if (atlIdx > -1) {
            newLadder.atl[atlIdx][1] = matched;
            newLadder.atbo[formatPriceKey(price)] = matched;
          } else {
            newLadder.atl.push([price, matched]);
            newLadder.atbo[formatPriceKey(price)] = matched;
          }
        }
        // newLadder.atb = newLadder.atb.filter((v) => {
        //   if (v[0] >= price) {
        //     delete newLadder.atlo[formatPriceKey(v[0])];
        //     return false;
        //   }
        //   return true;
        // });
      }
    }
  }

  const LTP = newLadder.ltp[0];

  newLadder.atb = newLadder.atb.filter(([price]) => {
    if (LTP && price > LTP) {
      delete newLadder.atlo[formatPriceKey(price)];
      return false;
    }
    return true;
  });

  newLadder.atl = newLadder.atl.filter(([price]) => {
    if (LTP && price < LTP) {
      delete newLadder.atbo[formatPriceKey(price)];
      return false;
    }
    return true;
  });

  sortAsc(newLadder.trd);
  sortDes(newLadder.atb);
  sortAsc(newLadder.atl);

  newLadder.percent = calcBackLayPercentages(newLadder.atbo, newLadder.atlo, LTP);

  return newLadder;
};

