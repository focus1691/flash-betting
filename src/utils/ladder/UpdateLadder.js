import { calcBackLayPercentages } from './CreateLadder';
import { formatPriceKey } from '../Bets/PriceCalculations';
import { sortAsc, sortDes } from '../Sort';

const UpdateLadder = (ladder, rawData) => {
  ladder.expanded = Boolean(ladder.expanded);

  if (rawData.ltp) {
    ladder.ltp = [rawData.ltp, ...ladder.ltp];
    ladder.ltpDelta = new Date();
  }
  if (rawData.tv) {
    ladder.tv = [rawData.tv, ladder.tv[0]];
  }

  if (rawData.trd) {
    for (let i = 0; i < rawData.trd.length; i += 1) {
      if (rawData.trd[i]) {
        const price = rawData.trd[i][0];
        const volumeMatched = Math.floor(rawData.trd[i][1]);
        const index = ladder.trd.map((trd) => trd[0]).findIndex((val) => val === price);

        if (volumeMatched >= 100) {
          ladder.trdo[formatPriceKey(price)] = volumeMatched;
          if (index === -1) ladder.trd.push([price, volumeMatched]);
          else (ladder.trd[index][1] = volumeMatched);
        } else if (volumeMatched < 100) {
          delete ladder.trdo[formatPriceKey(price)];
          if (index > -1) ladder.trd.splice(index, 1);
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
          ladder.atb = ladder.atb.filter((v) => v[0] !== price);
          delete ladder.atlo[formatPriceKey(price)];
        } else {
          const atbIdx = ladder.atb.findIndex((v) => v[0] === price);
          const atlIdx = ladder.atl.findIndex((v) => v[0] === price);

          if (atlIdx > -1) {
            if (matched > ladder.atb[atlIdx][1]) {
              ladder.atl = ladder.atl.filter((v) => v[0] !== price);
              delete ladder.atbo[formatPriceKey(price)];
            } else if (matched > ladder.atl[atlIdx][1]) {
              ladder.atb = ladder.atb.filter((v) => v[0] !== price);
              delete ladder.atlo[formatPriceKey(price)];
            }
          } else if (atbIdx > -1) {
            ladder.atb[atbIdx][1] = matched;
            ladder.atlo[formatPriceKey(price)] = matched;
          } else {
            ladder.atb.push([price, matched]);
            ladder.atlo[formatPriceKey(price)] = matched;
          }
        }
        ladder.atl = ladder.atl.filter((v) => {
          if (v[0] <= price || (ladder.ltp[0] && v[0] < ladder.ltp[0])) {
            delete ladder.atbo[formatPriceKey(v[0])];
          }
          return v[0] > price || (ladder.ltp[0] && v[0] < ladder.ltp[0]);
        });
      }
    }
  }

  if (rawData.atl) {
    for (let i = 0; i < rawData.atl.length; i += 1) {
      if (rawData.atl[i]) {
        const price = rawData.atl[i][0];
        const matched = Math.floor(rawData.atl[i][1]);

        if (matched <= 0) {
          ladder.atl = ladder.atl.filter((v) => v[0] !== price);
          delete ladder.atbo[formatPriceKey(price)];
        } else {
          const atlIdx = ladder.atl.findIndex((v) => v[0] === price);
          const atbIdx = ladder.atb.findIndex((v) => v[0] === price);

          if (atbIdx > -1) {
            if (matched > ladder.atb[atbIdx][1]) {
              ladder.atb = ladder.atb.filter((v) => v[0] !== price);
              delete ladder.atlo[formatPriceKey(price)];
            } else if (matched > ladder.atb[atbIdx][1]) {
              ladder.atl = ladder.atl.filter((v) => v[0] !== price);
              delete ladder.atbo[formatPriceKey(price)];
            }
          } else if (atlIdx > -1) {
            ladder.atl[atlIdx][1] = matched;
            ladder.atbo[formatPriceKey(price)] = matched;
          } else {
            ladder.atl.push([price, matched]);
            ladder.atbo[formatPriceKey(price)] = matched;
          }
        }
        ladder.atb = ladder.atb.filter((v) => {
          if (v[0] >= price) {
            delete ladder.atlo[formatPriceKey(v[0])];
            return false;
          }
          return true;
        });
      }
    }
  }

  ladder.atb = ladder.atb.filter((v) => {
    if (ladder.ltp[0] && v[0] > ladder.ltp[0]) {
      delete ladder.atlo[formatPriceKey(v[0])];
      return false;
    }
    return true;
  });

  ladder.atl = ladder.atl.filter((v) => {
    if (ladder.ltp[0] && v[0] < ladder.ltp[0]) {
      delete ladder.atbo[formatPriceKey(v[0])];
      return false;
    }
    return true;
  });

  sortAsc(ladder.trd);
  sortDes(ladder.atb);
  sortAsc(ladder.atl);

  ladder.percent = calcBackLayPercentages(
    ladder.atbo,
    ladder.atlo,
    ladder.ltp[0],
  );

  return ladder;
};

export { UpdateLadder };
