/** An array of all BetFair values between 1.01 to 1000
 * Used in the stop loss check function below
 */
const ALL_PRICES = Array(100).fill()
  .map((a, l) => parseFloat((l / 100 + 1.01).toFixed(2)))
  .concat(Array(50).fill().map((a, l) => parseFloat((l / 50 + 2.02).toFixed(2))))
  .concat(Array(20).fill().map((a, l) => parseFloat((l / 20 + 3.05).toFixed(2))))
  .concat(Array(20).fill().map((a, l) => parseFloat((l / 10 + 4.1).toFixed(1))))
  .concat(Array(20).fill().map((a, l) => parseFloat((l / 5 + 6.2).toFixed(1))))
  .concat(Array(19).fill().map((a, l) => parseFloat((l / 2 + 10.5).toFixed(1))))
  .concat(Array(11).fill().map((a, l) => parseFloat((l + 20).toFixed(0))))
  .concat(Array(10).fill().map((a, l) => parseFloat((2 * l + 32).toFixed(0))))
  .concat(Array(10).fill().map((a, l) => parseFloat((5 * l + 55).toFixed(0))))
  .concat(Array(90).fill().map((a, l) => parseFloat((10 * l + 110).toFixed(0))));

/**
 * This function formats the price key used for the full ladder
 * @param {number} key - The price (1.01 - 1000)
 * @return {string} The formatted price
 */
const formatPriceKey = key => {
  return (Math.round(key * 100) / 100).toFixed(2);
};

const formatPrice = odds => {
  odds = parseFloat(odds);

  switch (true) {
    case odds < 4:
      return odds.toFixed(2);
    case odds < 20:
      return odds.toFixed(1);
    case odds >= 20:
      return odds.toFixed(0);
    default:
      return odds.toFixed(2);
  }
};

const getNextPrice = (prevPrice, nextPrice) => {
  if (prevPrice === nextPrice) return prevPrice;
  
  let priceIncreased = prevPrice < nextPrice;
  let index = ALL_PRICES.indexOf(prevPrice) + (priceIncreased ? 1 : -1);
  return ALL_PRICES[index];
}

const findPriceStep = v => {
  if (v >= 1.01 && v < 2) {
    return 0.01;
  }
  else if (v >= 2 && v < 3) {
    return 0.02;
  }
  else if (v >= 3 && v < 4) {
    return 0.05;
  }
  else if (v >= 4 && v < 6) {
    return 0.05;
  }
  else if (v >= 6 && v < 10) {
    return 0.1;
  }
  else if (v >= 10 && v < 20) {
    return 0.5;
  }
  else if (v >= 20 && v < 30) {
    return 1;
  }
  else if (v >= 30 && v < 50) {
    return 2;
  }
  else if (v >= 50 && v < 100) {
    return 5;
  }
  else if (v >= 100 && v <= 100) {
    return 10;
  }
};

const getPriceNTicksAway = (price, N) => {
  if (N === undefined || N === null || typeof N != "number") return null;
  if (N <= 0) return price;

  let index = ALL_PRICES.indexOf(price) + N;
  let newPrice = ALL_PRICES[index];

  if (newPrice === -1) return price;
  return newPrice;
};

/**
 * This function finds keys of back/lay price objects 5 places either side of the LTP
 * Used to calculate the back/lay percentages for the Ladder View
 * @param {number} ltp - The Last Traded Price
 * @return {object} The keys of back/lay price objects 5 places either side of the LTP
 */
const fivePricesAway = ltp => {
  var index = ALL_PRICES.indexOf(ltp);

  return {
    back: ALL_PRICES.slice(index + 1, index + 6).map((s, v) => formatPrice(s)),
    lay: ALL_PRICES.slice(index - 5, index).map((s, v) => formatPrice(s))
  };
};

/**
 * This function calculates the back/lay percentage of matched bets 5 prices away from the LTP
 * @param {object} ladder - The ladder for the runner
 * @param {object} ltp - The Last Traded Price
 * @return {object} The back/lay percentages
 */
const calcBackLayPercentages = (atbo, atlo, ltp) => {
  if (!ltp) {
    return { back: 0, lay: 0 };
  }

  // Get the prices for both back/lay trading 5 places either side of the LTP
  const indices = fivePricesAway(ltp);

  var layMatched = 0, backMatched = 0;
  var i;

  // Add the back total
  for (i = 0; i < indices.back.length; i++) {
    let price = indices.back[i];
    let matched = atbo[formatPriceKey(price)];
    if (matched) {
      backMatched += matched;
    }
  }

  // Add the lay total
  for (i = 0; i < indices.lay.length; i++) {
    let price = indices.lay[i];
    let matched = atlo[formatPriceKey(price)];

    if (matched) {
      layMatched += matched;
    }
  }

  const total = backMatched + layMatched;

  const backPercent = Math.round((backMatched / total) * 100);
  const layPercent = Math.round((layMatched / total) * 100);

  return { back: backPercent ? backPercent : 0, lay: layPercent ? layPercent : 0 };
};

export {
  formatPriceKey,
  formatPrice,
  ALL_PRICES,
  calcBackLayPercentages,
  getNextPrice,
  findPriceStep,
  getPriceNTicksAway
};