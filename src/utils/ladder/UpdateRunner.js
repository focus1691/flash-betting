
import { SearchInsert } from "../Algorithms/SearchInsert";
import { formatPriceKey, calcBackLayPercentages } from "../ladder/CreateFullLadder";

const UpdateRunner = (ladder, rawData) => {

  if (rawData.ltp) {
    ladder.ltp = [rawData.ltp, ...ladder.ltp];
  }
  if (rawData.tv) {
    ladder.tv = [rawData.tv, ladder.tv[0]];
  }

  // Update the atb values
  if (rawData.atb) {

    let newAtb = ladder.atb;

    for (var j = 0; j < rawData.atb.length; j++) {

      // Filter out values > 0 and < 1
      if (rawData.atb[j][1] > 0 && Math.floor(rawData.atb[j][1] <= 0)) continue;

      const price = rawData.atb[j][0];
      const matched = Math.floor(rawData.atb[j][1]);

      const index = SearchInsert(newAtb, price, true);

      if (!newAtb[index]) continue;

      if (matched <= 0) {
        if (price === newAtb[index][0]) {
          newAtb.splice(index, 1);
          ladder.fullLadder[formatPriceKey(price)].backMatched = null;
        }
      }
      else if (price === newAtb[index][0]) {
        newAtb[index][1] = matched;
        ladder.fullLadder[formatPriceKey(price)].backMatched = matched;
      }
      else {
        newAtb.splice(index, 0, [price, matched]);
        ladder.fullLadder[formatPriceKey(price)].backMatched = matched;
      }
    }
  }

  // Update the atl values
  if (rawData.atl) {

    let newAtl = ladder.atl;

    for (var j = 0; j < rawData.atl.length; j++) {

      // Filter out values > 0 and < 1
      if (rawData.atl[j][1] > 0 && Math.floor(rawData.atl[j][1] <= 0)) continue;

      const price = rawData.atl[j][0];
      const matched = Math.floor(rawData.atl[j][1]);

      const index = SearchInsert(newAtl, price, false);

      if (!newAtl[index]) continue;

      if (matched <= 0) {
        if (price === newAtl[index][0]) {
          newAtl.splice(index, 1);
          ladder.fullLadder[formatPriceKey(price)].layMatched = null;
        }
      }
      else if (price === newAtl[index][0]) {
        newAtl[index][1] = matched;
        ladder.fullLadder[formatPriceKey(price)].layMatched = matched;
      }
      else {
        newAtl.splice(index, 0, [price, matched]);
        ladder.fullLadder[formatPriceKey(price)].layMatched = matched;
      }
    }
  }

  ladder.percent = calcBackLayPercentages(ladder.fullLadder, ladder.ltp[0]);

  return ladder;
}

export { UpdateRunner };