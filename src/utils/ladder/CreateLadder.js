import { formatPriceKey, fivePricesAway } from '../Bets/PriceCalculations';

export const CreateLadder = (ladder) => {
  ladder.ltp = ladder.ltp ? [ladder.ltp] : [null];
  ladder.tv = ladder.tv ? [ladder.tv, ladder.tv] : [null, null];
  ladder.atb = ladder.atb || [];
  ladder.atl = ladder.atl || [];
  ladder.atbo = {};
  ladder.atlo = {};
  ladder.trd = ladder.trd || [];
  ladder.trdo = {};
  ladder.order = {
    visible: false,
    side: 'BACK',
    stakeLiability: 0,
    stake: 2,
    price: 0,
  };
  ladder.expanded = false;
  ladder.bottom = 'graph';

  // make it easier for ladder
  ladder.trd.forEach(([price, size]) => {
    ladder.trdo[formatPriceKey(price)] = size;
  });

  for (let i = 0; i < ladder.atb.length; i += 1) {
    let [price, matched] = ladder.atb[i];
    price = formatPriceKey(price);
    matched = Math.floor(matched);

    if (matched <= 0) {
      ladder.atb.splice(i, 1);
      i -= 1;
    } else {
      // Alter the value to round down
      ladder.atb[i][1] = matched;
      ladder.atlo[price] = matched;
    }
  }

  for (let i = 0; i < ladder.atl.length; i += 1) {
    let [price, matched] = ladder.atl[i];
    price = formatPriceKey(price);
    matched = Math.floor(matched);

    if (matched <= 0) {
      ladder.atl.splice(i, 1);
      i -= 1;
    } else {
      // Alter the value to round down
      ladder.atl[i][1] = matched;

      ladder.atbo[price] = matched;
    }
  }

  ladder.percent = calcBackLayPercentages(ladder.atbo, ladder.atlo, ladder.ltp[0]);

  return ladder;
};

/**
 * This function calculates the back/lay percentage of matched bets 5 prices away from the LTP
 * @param {object} ladder - The ladder for the ladder
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
