
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

    if (!ladder.atb) {
      ladder.atb = [];
    }

    let newAtb = ladder.atb;

    rawData.atb.map(atb => {
      // Filter out values > 0 and < 1
      if (atb[1] > 0 && Math.floor(atb[1] <= 0)) return;

      const price = atb[0];
      const matched = Math.floor(atb[1]);

      const index = SearchInsert(newAtb, price, true);

      if (!newAtb[index]) return;

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
    });
  }

  // Update the atl values
  if (rawData.atl) {

    if (!ladder.atl) {
      ladder.atb = [];
    }
    let newAtl = ladder.atl;

    rawData.atl.map(atl => {
      // Filter out values > 0 and < 1
      if (atl[1] > 0 && Math.floor(atl[1] <= 0)) return;

      const price = atl[0];
      const matched = Math.floor(atl[1]);

      const index = SearchInsert(newAtl, price, false);

      if (!newAtl[index]) return;

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
    });
  }

  ladder.percent = calcBackLayPercentages(ladder.fullLadder, ladder.ltp[0]);

  return ladder;
}

export { UpdateRunner };