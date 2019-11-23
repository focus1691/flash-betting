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

const createFullLadder = () => {
  const Ladders = {};
  var k;

  // 100 - 1000
  for (k = 1000; k >= 100; k -= 10) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 50 - 100
  for (k = 95; k >= 50; k -= 5) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 30 - 50
  for (k = 50; k >= 30; k -= 2) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 20 - 30
  for (k = 30; k >= 20; k -= 1) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 10 - 20
  for (k = 20; k >= 10; k -= 0.5) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 6 - 10
  for (k = 10; k >= 6; k -= 0.2) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 4 - 6
  for (k = 6; k >= 4; k -= 0.1) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 3 - 4
  for (k = 4; k >= 3; k -= 0.05) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 2 - 3
  for (k = 3; k >= 2; k -= 0.02) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }

  // 1 - 2
  for (k = 2; k >= 1; k -= 0.01) {
    let priceKey = formatPriceKey(k);
    Ladders[priceKey] = createDataPoints(priceKey);
  }
  return Ladders;
};

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

const getNextPrice = (currentPrice, selectedVal) => {
  if (currentPrice === selectedVal) return currentPrice;
  
  let priceIncreased = currentPrice < selectedVal;
  let index = ALL_PRICES.indexOf(currentPrice) + (priceIncreased ? 1 : -1);

  let newPrice = ALL_PRICES[index];

  if (newPrice === -1) return currentPrice;
  return newPrice;
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
const getFiveDeviationBackLayPrices = ltp => {
  var index = ALL_PRICES.indexOf(ltp);

  return {
    lay: ALL_PRICES.slice(index + 1, index + 6).map((s, v) => formatPriceKey(s)),
    back: ALL_PRICES.slice(index - 5, index).map((s, v) => formatPriceKey(s))
  };
};

/**
 * This function calculates the back/lay percentage of matched bets 5 prices away from the LTP
 * @param {object} ladder - The ladder for the runner
 * @param {object} ltp - The Last Traded Price
 * @return {object} The back/lay percentages
 */
const calcBackLayPercentages = (ladder, ltp) => {
  if (!ltp) {
    return { back: 0, lay: 0 };
  }

  // Get the prices for both back/lay trading 5 places either side of the LTP
  const indices = getFiveDeviationBackLayPrices(ltp);

  var layMatched = 0, backMatched = 0;
  var i;

  // Add the back total
  for (i = 0; i < indices.back.length; i++) {
    let data = ladder[indices.back[i]];
    layMatched += ((data) && data.layMatched) ? data.layMatched : 0;
  }

  // Add the lay total
  for (i = 0; i < indices.lay.length; i++) {
    let data = ladder[indices.lay[i]];
    backMatched += ((data) && data.backMatched) ? data.backMatched : 0;
  }

  const total = backMatched + layMatched;

  const backPercent = Math.round((backMatched / total) * 100);
  const layPercent = Math.round((layMatched / total) * 100);

  return { back: backPercent ? backPercent : 0 , lay: layPercent ? layPercent : 0 };
};


const createDataPoints = odds => {
  return {
    backProfit: null,
    backMatched: null,
    odds: odds,
    layMatched: null,
    layProfit: null
  };
};

export {
  createFullLadder,
  formatPriceKey,
  formatPrice,
  ALL_PRICES,
  calcBackLayPercentages,
  getNextPrice,
  getPriceNTicksAway
};
