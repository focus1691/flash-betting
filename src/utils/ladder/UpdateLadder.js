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

      if (volumeMatched >= 100) {
        ladder.trdo[formatPriceKey(price)] = volumeMatched;
        index === -1
          ? ladder.trd.push([price, volumeMatched])
          : (ladder.trd[index][1] = volumeMatched);
      } else if (volumeMatched < 100) {
        delete ladder.trdo[formatPriceKey(price)];
        if (index !== -1) ladder.trd.splice(index, 1);
      }
    });
    sortAsc(ladder.trd);
  }

  // Update the atb values
  if (rawData.atb) {
    rawData.atb.forEach(atb => {
      let price = atb[0];
      let matched = Math.floor(atb[1]);
      let atbIdx = ladder.atb
        .map(atb => atb[0])
        .findIndex(val => val === price);
      let atlIdx = ladder.atl
        .map(atl => atl[0])
        .findIndex(val => val === price);

      // Available to BACK
      if (matched >= 1) {
        ladder.atlo[formatPriceKey(price)] = matched;

        let difference =
          (ladder.atbo[formatPriceKey(price)] || 0) -
          ladder.atlo[formatPriceKey(price)];

        if (difference > 0) {
          delete ladder.atlo[formatPriceKey(price)];
          if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);

          ladder.atbo[formatPriceKey(price)] = Math.abs(difference);
        } else if (difference < 0) {
          atbIdx === -1
            ? ladder.atb.push([price, matched])
            : (ladder.atb[atbIdx][1] = matched);
          ladder.atlo[formatPriceKey(price)] = Math.abs(difference);

          delete ladder.atbo[formatPriceKey(price)];
          if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
        } else {
          delete ladder.atbo[formatPriceKey(price)];
          delete ladder.atlo[formatPriceKey(price)];

          if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
          if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
        }
      }
      // Remove BACK matched bets
      else if (matched <= 0) {
        delete ladder.atlo[formatPriceKey(price)];
        if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
      }
    });
    sortDes(ladder.atb);
  }

  // Update the atl values
  if (rawData.atl) {
    rawData.atl.forEach(atl => {
      let price = atl[0];
      let matched = Math.floor(atl[1]);
      let atlIdx = ladder.atl
        .map(atl => atl[0])
        .findIndex(val => val === price);
      let atbIdx = ladder.atb
        .map(atb => atb[0])
        .findIndex(val => val === price);

      // Available to LAY
      if (matched >= 1) {
        // No BACK requests at this price, so simply add/update the new lay request

        ladder.atbo[formatPriceKey(price)] = matched;

        let difference =
          (ladder.atlo[formatPriceKey(price)] || 0) -
          ladder.atbo[formatPriceKey(price)];

        if (difference > 0) {
          delete ladder.atbo[formatPriceKey(price)];

          if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);

          ladder.atlo[formatPriceKey(price)] = Math.abs(difference);
        } else if (difference < 0) {
          atlIdx === -1
            ? ladder.atl.push([price, matched])
            : (ladder.atl[atlIdx][1] = matched);
          ladder.atbo[formatPriceKey(price)] = Math.abs(difference);

          delete ladder.atlo[formatPriceKey(price)];
          if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
        } else {
          delete ladder.atbo[formatPriceKey(price)];
          delete ladder.atlo[formatPriceKey(price)];

          if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
          if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
        }
      }
      // Remove LAY matched bets
      else if (matched <= 0) {
        delete ladder.atbo[formatPriceKey(price)];
        if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
      }
    });
    sortAsc(ladder.atl);
  }

  let highestAtb = Math.max(ladder.atb.map(atb => atb[0]));
  var i;

  // Remove all the Available to Lays that have matched prices less than Back
  for (i = 0; i < ladder.atl.length; i++) {
    if (highestAtb > ladder.atl[i][0]) {
      ladder.atl.splice(i, 1);
      delete ladder.atbo[formatPriceKey(ladder.atl[i][0])];
      i--;
    }
  }

  let lowestAtl = Math.min(ladder.atl.map(atl => atl[0]));

  // Remove all the Available to Backs that have matched prices more than Lay
  for (i = 0; i < ladder.atb.length; i++) {
    if (lowestAtl < ladder.atb[i][0]) {
      ladder.atb.splice(i, 1);
      delete ladder.atlo[formatPriceKey(ladder.atb[i][0])];
      i--;
    }
  }

  ladder.percent = calcBackLayPercentages(
    ladder.atbo,
    ladder.atlo,
    ladder.ltp[0]
  );

  return ladder;
};

export { UpdateLadder };