const sumMatchedBets = ladder => {
  const sum = Object.keys(ladder).reduce(
    (sum, key) => sum + parseFloat(ladder[key].tv[0] || 0),
    0
  );
  return sum ? Math.floor(sum) : "";
};

const calcBackProfit = (stake, price, side) => {
  const profit = stake * price - stake;
  if (side === 0) return profit || 0;
  else if (side === 1) return -profit || 0;
};

const calcLiability = (stake, side) => {
  return (side === 0) ? Math.abs(stake) : -stake;
};

const colorForBack = side => {
  return side === 0 ? "#01CC41" : "red";
};

const colorForLay = side => {
  return side === 0 ? "red" : "#01CC41";
};

export { sumMatchedBets, calcBackProfit, calcLiability, colorForBack, colorForLay };
