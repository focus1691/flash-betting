
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

  if (rawData.trd) {
    rawData.trd.forEach(trd => {
      let price = trd[0];
      let volumeMatched = Math.floor(trd[1]);
      let index = ladder.trd.map(trd => trd[0]).findIndex(val => val === price);

      if (index === -1 && volumeMatched >= 100) {
        ladder.trd.push([price, volumeMatched]);
        ladder.trdo[formatPriceKey(price)] = volumeMatched;
      }
      else if (volumeMatched < 100) {
        ladder.trd.splice(index, 1);
        delete ladder.trdo[formatPriceKey(price)];
      }
      else if (volumeMatched >= 100) {
        ladder.trd[index][1] = volumeMatched;
        ladder.trdo[formatPriceKey(price)] = volumeMatched;
      }
    });
    sortAsc(ladder.trd);
  }

  // Update the atb values
  if (rawData.atb) {
    rawData.atb.forEach(atb => {
      let price = atb[0];
      let matched = Math.floor(atb[1]);
      let index = ladder.atb.map(atb => atb[0]).findIndex(val => val === price);

      if (index === -1 && matched >= 1) {
        ladder.atb.push([price, matched]);
        ladder.atbo[formatPriceKey(price)] = matched;
      }
      else if (matched >= 1) {
        ladder.atb[index][1] = matched;
        ladder.atbo[formatPriceKey(price)] = matched;
      }
      else if (matched <= 0) {
        ladder.atb.splice(index, 1);
        delete ladder.atbo[formatPriceKey(price)];
      }
    });
    sortDes(ladder.atb);
  }

  // Update the atl values
  if (rawData.atl) {
    rawData.atl.forEach(atl => {
      let price = atl[0];
      let matched = Math.floor(atl[1]);
      let index = ladder.atl.map(atl => atl[0]).findIndex(val => val === price);

      if (index === -1 && matched >= 1) {
        ladder.atl.push([price, matched]);
        ladder.atlo[formatPriceKey(price)] = matched;
      }
      else if (matched >= 1) {
        ladder.atl[index][1] = matched;
        ladder.atlo[formatPriceKey(price)] = matched;
      }
      else if (matched <= 0) {
        ladder.atl.splice(index, 1);
        delete ladder.atlo[formatPriceKey(price)];
      }
    });
    sortAsc(ladder.atl);
  }

  ladder.percent = calcBackLayPercentages(ladder.atbo, ladder.atlo, ladder.ltp[0]);

  return ladder;
}

export { UpdateLadder };