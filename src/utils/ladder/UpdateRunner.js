
import { SearchInsert } from "../SearchInsert";

const UpdateRunner = (oldData, rawData) => {

    if (rawData.ltp) {
        oldData.ltp = [rawData.ltp, ...oldData.ltp];
    }
    if (rawData.tv) {
      oldData.tv = [rawData.tv, oldData.tv[0]];
    }

    // Update the atb values
    if (rawData.atb) {

      let newAtb = oldData.atb;

      for (var j = 0; j < rawData.atb.length; j++) {

        const price = rawData.atb[j][0];
        const matched = Math.floor(rawData.atb[j][1]);
  
        const index = SearchInsert(newAtb, price, true);

        if (price === oldData.atb[index][0]) {

          if (matched <= 0) {
            newAtb.splice(index, 1);
          } else {
            newAtb[index][1] = matched;
          }
        } else {
          newAtb.splice(index, 0, rawData.atb[j]);
        }
      }
    }

    // Update the atl values
    if (rawData.atl) {

      let newAtl = oldData.atl;

      for (var j = 0; j < rawData.atl.length; j++) {

        const price = rawData.atl[j][0];
        const matched = Math.floor(rawData.atl[j][1]);
  
        const index = SearchInsert(newAtl, price, false);

        if (price === oldData.atl[index][0]) {

          if (matched <= 0) {
            newAtl.splice(index, 1);
          } else {
            newAtl[index][1] = matched;
          }
        } else {
          newAtl.splice(index, 0, rawData.atl[j]);
        }
      }
    }

    return oldData;
}

export { UpdateRunner };