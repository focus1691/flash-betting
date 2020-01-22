import { formatPriceKey, calcBackLayPercentages } from "./CreateFullLadder";
import { sortAsc, sortDes } from "../Algorithms/Sort";

const UpdateLadder = (ladder, rawData) => {
  if (rawData.ltp) {
    ladder.ltp = [rawData.ltp, ...ladder.ltp];
    ladder.ltpDelta = new Date();
  }
  if (rawData.tv) {
    ladder.tv = [rawData.tv, ladder.tv[0]];
  }

  rawData.trd &&
    rawData.trd.forEach(trd => {
      let price = trd[0];
      let volumeMatched = Math.floor(trd[1]);
      let index = ladder.trd.map(trd => trd[0]).findIndex(val => val === price);

      if (volumeMatched >= 100) {
        ladder.trdo[formatPriceKey(price)] = volumeMatched;
        index === -1
          ? ladder.trd.push([price, volumeMatched])
          : (ladder.trd[index][1] = volumeMatched);
      } else if (volumeMatched < 100) {
        delete ladder.trdo[formatPriceKey(price)];
        if (index > -1) ladder.trd.splice(index, 1);
      }
    });

  // Update the atb values
  rawData.atb &&
    rawData.atb.forEach(atb => {
      let price = atb[0];
      let matched = Math.floor(atb[1]);

      if (matched <= 0) {
        ladder.atb = ladder.atb.filter(v => v[0] !== price);
        delete ladder.atlo[formatPriceKey(price)];
      } else {
        let atbIdx = ladder.atb.findIndex(v => v[0] === price);
        let atlIdx = ladder.atl.findIndex(v => v[0] === price);

        if (atlIdx > -1) {
          if (matched > ladder.atb[atlIdx][1]) {
            ladder.atl = ladder.atl.filter(v => v[0] !== price);
            delete ladder.atbo[formatPriceKey(price)];
          } else if (matched > ladder.atl[atlIdx][1]) {
            ladder.atb = ladder.atb.filter(v => v[0] !== price);
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
      ladder.atl = ladder.atl.filter(v => {
        if (v[0] <= price) {
          delete ladder.atbo[formatPriceKey(v[0])];
        }
        return v[0] > price;
      });
    });

  // Update the atl values
  rawData.atl &&
    rawData.atl.forEach(atl => {
      let price = atl[0];
      let matched = Math.floor(atl[1]);

      if (matched <= 0) {
        ladder.atl = ladder.atl.filter(v => v[0] !== price);
        delete ladder.atbo[formatPriceKey(price)];
      } else {
        let atlIdx = ladder.atl.findIndex(v => v[0] === price);
        let atbIdx = ladder.atb.findIndex(v => v[0] === price);

        if (atbIdx > -1) {
          if (matched > ladder.atb[atbIdx][1]) {
            ladder.atb = ladder.atb.filter(v => v[0] !== price);
            delete ladder.atlo[formatPriceKey(price)];
          } else if (matched > ladder.atb[atbIdx][1]) {
            ladder.atl = ladder.atl.filter(v => v[0] !== price);
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
      ladder.atb = ladder.atb.filter(v => {
        if (v[0] >= price) {
          delete ladder.atlo[formatPriceKey(v[0])];
        }
        return v[0] < price;
      });
    });

  sortAsc(ladder.trd);
  sortDes(ladder.atb);
  sortAsc(ladder.atl);

  ladder.percent = calcBackLayPercentages(
    ladder.atbo,
    ladder.atlo,
    ladder.ltp[0]
  );

  return ladder;
};

export { UpdateLadder };