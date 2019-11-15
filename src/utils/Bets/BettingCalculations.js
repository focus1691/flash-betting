/**
 * This function sums all matched bets to find the total.
 * @param {object} ladder - The ladder containing the price data for a runner.
 * @return {number} The total matched bets for the runner.
 */
const sumMatchedBets = ladder => {
  const sum = Object.keys(ladder).reduce(
    (sum, key) => sum + parseFloat(ladder[key].tv[0] || 0),
    0
  );
  return sum ? Math.floor(sum) : "";
};

/**
 * This function calculates the percent difference between matched and current prices.
 * @param {number} size - The ladder containing the price data for a runner.
 * @param {number} matchedPrice - The price the bet was placed at for runner.
 * @param {number} currentPrice - The current trading price of the runner
 * @return {percentDifference} The percent increase or decrease.
 */
const calcPercentDifference = (size, matchedPrice, currentPrice) => {
  let initialPL = Math.round((size * matchedPrice - size) * 100) / 100;
  let currPL = Math.round((size * currentPrice - size) * 100) / 100;

  // Round to remove the decimals and absolute to remove negatives
  let percentDifference = Math.abs(Math.round((currPL - initialPL) * 100) /100) / currPL * 100;
  percentDifference = Math.floor(percentDifference);

  return percentDifference;
};

const twoDecimalPlaces = num => {
  return parseFloat((Math.round(num * 100) / 100).toFixed(2));
};

const calcBackProfit = (stake, price, side) => {
  const profit = parseFloat((stake * price - stake).toFixed(2));
  if (side === 0) return profit || 0;
  else if (side === 1) return -profit || 0;
};

const calcLiability = (stake, side) => {
  if (side === 0) return -stake;
  return Math.abs(stake);
};

const colorForBack = (side, pl = 0) => {
  if (side === 0 && pl > 0) return "#01CC41";
  else return 'red';
};

const colorForLay = side => {
  return side === 0 ? "red" : "#01CC41";
};

export { sumMatchedBets, calcPercentDifference, calcBackProfit, calcLiability, colorForBack, colorForLay, twoDecimalPlaces };
