
import { formatPriceKey } from "./CreateFullLadder";
import { SearchInsert } from "../SearchInsert";

const UpdateRunner = (oldData, newData) => {

    if (newData.ltp) {
        oldData.ltp = [newData.ltp, ...oldData.ltp];
    }
    if (newData.tv) {
      oldData.tv = [newData.tv, oldData.tv[0]];
    }

    // Update the atb values
    if (newData.atb) {
      for (var j = 0; j < newData.atb.length; j++) {
        let priceKey = formatPriceKey(newData.atb[j][0]);
        oldData.fullLadder[priceKey].odds = priceKey;
        oldData.fullLadder[priceKey].backMatched =
          newData.atb[j][1];
      }
      let newAtb = oldData.atb;
      for (j = 0; j < newData.atb.length; j++) {
        const odds = newData.atb[j][0];
        const matched = newData.atb[j][1];

        const index = SearchInsert(newAtb, parseInt(odds));
        if (odds == newAtb[index]) {
          if (matched == 0) {
            newAtb.splice(index, 1);
          } else {
            newAtb[index][1] = matched;
          }
        } else {
          newAtb.splice(index, 0, newData.atb[j]);
        }
      }
    }

    // Update the atl values
    if (newData.atl) {
      for (j = 0; j < newData.atl.length; j++) {
        let priceKey = formatPriceKey(newData.atl[j][0]);
        oldData.fullLadder[priceKey].odds = priceKey;
        oldData.fullLadder[priceKey].layMatched =
          newData.atl[j][1];
      }
    }
    return oldData;
}

export { UpdateRunner };