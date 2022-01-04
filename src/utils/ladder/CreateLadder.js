import { formatPriceKey, fivePricesAway } from '../Bets/PriceCalculations';

export const CreateLadder = (rawData) => {
  const ladder = {
    ltp: [rawData.ltp || null],
    tv: rawData.tv ? [rawData.tv, rawData.tv] : [null, null],
    atbo: {},
    atlo: {},
    trd: rawData.trd || [],
    trdo: {},
    order: {
      visible: false,
      side: 'BACK',
      stakeLiability: 0,
      stake: 2,
      price: 0,
    },
    expanded: false,
    bottom: 'graph',
  }

  // make it easier for ladder
  if (rawData.trd) {
    rawData.trd.forEach(([price, size]) => {
      ladder.trdo[formatPriceKey(price)] = size;
    });    
  }

  if (rawData.atb) {
    for (let i = 0; i < rawData.atb.length; i += 1) {
      let [price, matched] = rawData.atb[i];
      price = formatPriceKey(price);
      matched = Math.floor(matched);

      if (matched > 0) {
        ladder.atlo[price] = matched;
      }
    }
  }

  if (rawData.atl) {
    for (let i = 0; i < rawData.atl.length; i += 1) {
      let [price, matched] = rawData.atl[i];
      price = formatPriceKey(price);
      matched = Math.floor(matched);

      if (matched > 0) {
        ladder.atbo[price] = matched;
      }
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
