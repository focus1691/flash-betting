const sumMatchedBets = ladder => {
  const sum = Object.keys(ladder).reduce(
    (sum, key) => sum + parseFloat(ladder[key].tv[0] || 0),
    0
  );
  return sum ? Math.floor(sum) : "";
};

const calcPercentDifference = (size, matchedPrice, currentPrice) => {
  let initialPL = Math.round((size * matchedPrice - size) * 100) / 100;
  let currPL = Math.round((size * currentPrice - size) * 100) / 100;
  let percentIncrease = Math.abs(Math.round((currPL - initialPL) * 100) /100) / currPL * 100;
  percentIncrease = Math.floor(percentIncrease);

  return percentIncrease;
};

const calcBackProfit = (stake, price, side) => {
  const profit = stake * price - stake;
  if (side === 0) return profit || 0;
  else if (side === 1) return -profit || 0;
};

const calcLiability = (stake, side) => {
  if (side === 0) return -stake;
  return Math.abs(stake);
};

const colorForBack = side => {
  return side === 0 ? "#01CC41" : "red";
};

const colorForLay = side => {
  return side === 0 ? "red" : "#01CC41";
};

export { sumMatchedBets, calcPercentDifference, calcBackProfit, calcLiability, colorForBack, colorForLay };
