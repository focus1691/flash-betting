
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
        index === -1 ? ladder.trd.push([price, volumeMatched]) : ladder.trd[index][1] = volumeMatched;
      }
      else if (volumeMatched < 100) {
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
      let atbIdx = ladder.atb.map(atb => atb[0]).findIndex(val => val === price);
      let atlIdx = ladder.atl.map(atl => atl[0]).findIndex(val => val === price);

      // Available to BACK
      if (matched >= 1) {

        // No LAY requests at this price, so simply add/update the new back request
        if (atlIdx === -1) {
          ladder.atlo[formatPriceKey(price)] = matched;
          atbIdx === -1 ? ladder.atb.push([price, matched]) : ladder.atb[atbIdx][1] = matched;
        }

        // Handle back requests that already have back/lay requests at this price
        else {
          let totalBackRequest = matched + (ladder.atlo[formatPriceKey(price)] || 0);
          let layMatched = ladder.atbo[formatPriceKey(price)] || 0;

          let difference = layMatched - totalBackRequest;
          matched = Math.abs(difference);

          // More Lay requests than Backs so we subtract the lay requests from the back requests.
          if (difference < 0) {
            ladder.atbo[formatPriceKey(price)] = matched;
            atlIdx === -1 ? ladder.atl.push([price, matched]) : ladder.atl[atlIdx][1] = matched;

            delete ladder.atlo[formatPriceKey(price)];
            if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
          }

          // More Back requests than Lays so we subtract the Back requests from the Lay requests.
          else if (difference > 0) {
            ladder.atlo[formatPriceKey(price)] = matched;
            atbIdx === -1 ? ladder.atb.push([price, matched]) : ladder.atb[atbIdx][1] = matched;

            delete ladder.atbo[formatPriceKey(price)];
            if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
          }

          // Back and Lay requests cancel each other out, so remove all.
          else if (difference === 0) {
            delete ladder.atlo[formatPriceKey(price)];
            delete ladder.atbo[formatPriceKey(price)];
            if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
            if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
          }
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
      let atlIdx = ladder.atl.map(atl => atl[0]).findIndex(val => val === price);
      let atbIdx = ladder.atb.map(atb => atb[0]).findIndex(val => val === price);

      // Available to LAY
      if (matched >= 1) {
        // No BACK requests at this price, so simply add/update the new lay request
        if (atbIdx === -1) {
          ladder.atbo[formatPriceKey(price)] = matched;
          atlIdx === -1 ? ladder.atl.push([price, matched]) : ladder.atl[atlIdx][1] = matched;
        }
        
        // Handle lay requests that already have back/lay requests at this price
        else {
          let totalLayRequest = matched + (ladder.atbo[formatPriceKey(price)] || 0);
          let backMatched = ladder.atlo[formatPriceKey(price)] || 0;

          let difference = backMatched - totalLayRequest;
          matched = Math.abs(difference);

          // More Back requests than Lays so we subtract the back requests from the lay requests.
          if (difference < 0) {
            ladder.atlo[formatPriceKey(price)] = matched;
            atbIdx === -1 ? ladder.atb.push([price, matched]) : ladder.atb[atbIdx][1] = matched;

            delete ladder.atbo[formatPriceKey(price)];
            if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
          }

          // More Lay requests than Backs so we subtract the Lay requests from the Back requests.
          else if (difference > 0) {
            ladder.atbo[formatPriceKey(price)] = matched;
            atlIdx === -1 ? ladder.atl.push([price, matched]) : ladder.atl[atlIdx][1] = matched;

            delete ladder.atlo[formatPriceKey(price)];
            if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
          }

          // Lay and Back requests cancel each other out, so remove all.
          else if (difference === 0) {
            delete ladder.atlo[formatPriceKey(price)];
            delete ladder.atbo[formatPriceKey(price)];
            if (atbIdx !== -1) ladder.atb.splice(atbIdx, 1);
            if (atlIdx !== -1) ladder.atl.splice(atlIdx, 1);
          }
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

  ladder.percent = calcBackLayPercentages(ladder.atbo, ladder.atlo, ladder.ltp[0]);

  return ladder;
}

export { UpdateLadder };