/** An array of all BetFair values between 1.01 to 1000
 * Used in the stop loss check function below
 */
export const ALL_PRICES = Array(100).fill()
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
export const formatPriceKey = (key) => (Math.round(key * 100) / 100).toFixed(2);

export const isValidPrice = (price) => {
  return ALL_PRICES.indexOf(Number(price)) > -1;
};

export const formatPrice = (odds) => {
  odds = parseFloat(odds);

  if (odds < 4) return odds.toFixed(2);
  if (odds < 20) return odds.toFixed(1);
  if (odds >= 20) return odds.toFixed(0);
  return odds.toFixed(2);
};

export const getNextPrice = (prevPrice, nextPrice) => {
  prevPrice = Number(prevPrice);
  nextPrice = Number(nextPrice);

  if (prevPrice === nextPrice) return prevPrice; // Keep the previous price if nothing changed

  const isPriceIncreased = prevPrice < nextPrice;

  const index = ALL_PRICES.indexOf(prevPrice) + (isPriceIncreased ? 1 : -1); // Find index of the next price
  const roundedIndex = Math.min(Math.max(0, index), ALL_PRICES.length - 1); // Next price must be in the price array bounds

  return ALL_PRICES[roundedIndex];
};

export const findPriceStep = (v) => {
  if (v >= 1.01 && v < 2) {
    return 0.01;
  } if (v >= 2 && v < 3) {
    return 0.02;
  } if (v >= 3 && v < 4) {
    return 0.05;
  } if (v >= 4 && v < 6) {
    return 0.05;
  } if (v >= 6 && v < 10) {
    return 0.1;
  } if (v >= 10 && v < 20) {
    return 0.5;
  } if (v >= 20 && v < 30) {
    return 1;
  } if (v >= 30 && v < 50) {
    return 2;
  } if (v >= 50 && v < 100) {
    return 5;
  } if (v >= 100 && v <= 1000) {
    return 10;
  }
};

export const getPriceFromForm = (e, currentPrice, step) => {
  const v = Number(e.target.value);

  // Set empty String for non-numbers
  if (isNaN(v)) return { newPrice: '' };

  if (currentPrice === '' && v <= 1.01) {
    return { newPrice: 1.01, newStep: 0.01 };
  }

  const newStep = findPriceStep(v);

  if (newStep !== step) return { newStep };

  return { newPrice: v };
};

export const getPriceNTicksAway = (price, N) => {
  if (N === undefined || N === null || typeof N !== 'number') return null;
  if (N <= 0) return price;

  const index = ALL_PRICES.indexOf(price) + N;
  const newPrice = ALL_PRICES[index];

  if (newPrice === -1) return price;
  return newPrice;
};

/**
 * This function finds keys of back/lay price objects 5 places either side of the LTP
 * Used to calculate the back/lay percentages for the Ladder View
 * @param {number} ltp - The Last Traded Price
 * @return {object} The keys of back/lay price objects 5 places either side of the LTP
 */
export const fivePricesAway = (ltp) => {
  const index = ALL_PRICES.indexOf(ltp);

  return {
    back: ALL_PRICES.slice(index + 1, index + 6).map((s) => formatPrice(s)),
    lay: ALL_PRICES.slice(index - 5, index).map((s) => formatPrice(s)),
  };
};
