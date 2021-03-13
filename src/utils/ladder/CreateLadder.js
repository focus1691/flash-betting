import { sortAsc, sortDes } from '../Sort';
import { formatPriceKey, fivePricesAway } from './CreateFullLadder';

export const CreateLadder = (data) => {
  const runner = data;
  runner.id = data.id;
  runner.ltp = runner.ltp ? [runner.ltp] : [null];
  runner.ltpDelta = new Date();
  runner.tv = runner.tv ? [runner.tv, runner.tv] : [null, null];
  runner.atb = runner.atb || [];
  runner.atl = runner.atl || [];
  runner.atbo = {};
  runner.atlo = {};
  runner.trd = runner.trd || [];
  runner.trdo = {};
  runner.order = {
    visible: false,
    side: 'BACK',
    stakeLiability: 0,
    stake: 2,
    price: 0,
  };

  // make it easier for ladder
  runner.trd.forEach((trd) => {
    runner.trdo[formatPriceKey(trd[0])] = trd[1];
  });

  for (let i = 0; i < runner.atb.length; i += 1) {
    const price = formatPriceKey(runner.atb[i][0]);
    const matched = Math.floor(runner.atb[i][1]);

    if (matched <= 0) {
      runner.atb.splice(i, 1);
      i -= 1;
    } else {
      // Alter the value to round down
      runner.atb[i][1] = matched;

      runner.atlo[price] = matched;
    }
  }

  for (let i = 0; i < runner.atl.length; i += 1) {
    const price = formatPriceKey(runner.atl[i][0]);
    const matched = Math.floor(runner.atl[i][1]);

    if (matched <= 0) {
      runner.atl.splice(i, 1);
      i -= 1;
    } else {
      // Alter the value to round down
      runner.atl[i][1] = matched;

      runner.atbo[price] = matched;
    }
  }

  sortAsc(runner.trd);
  sortDes(runner.atb);
  sortAsc(runner.atl);

  runner.percent = calcBackLayPercentages(runner.atbo, runner.atlo, runner.ltp[0]);

  return runner;
};

/**
 * This function calculates the back/lay percentage of matched bets 5 prices away from the LTP
 * @param {object} ladder - The ladder for the runner
 * @param {object} ltp - The Last Traded Price
 * @return {object} The back/lay percentages
 */
 export const calcBackLayPercentages = (atbo, atlo, ltp) => {
  if (!ltp) {
    return { back: 0, lay: 0 };
  }

  // Get the prices for both back/lay trading 5 places either side of the LTP
  const indices = fivePricesAway(ltp);

  let layMatched = 0; let
    backMatched = 0;
  let i;

  // Add the back total
  for (i = 0; i < indices.back.length; i += 1) {
    const price = indices.back[i];
    const matched = atbo[formatPriceKey(price)];
    if (matched) {
      backMatched += matched;
    }
  }

  // Add the lay total
  for (i = 0; i < indices.lay.length; i += 1) {
    const price = indices.lay[i];
    const matched = atlo[formatPriceKey(price)];

    if (matched) {
      layMatched += matched;
    }
  }

  const total = backMatched + layMatched;

  const backPercent = Math.round((backMatched / total) * 100);
  const layPercent = Math.round((layMatched / total) * 100);

  return { back: backPercent || 0, lay: layPercent || 0 };
};
