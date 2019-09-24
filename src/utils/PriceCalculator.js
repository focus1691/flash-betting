const sumMatchedBets = ladder => {
  const sum = Object.keys(ladder).reduce(
    (sum, key) => sum + parseFloat(ladder[key].tv[0] || 0),
    0
  );
  return sum ? Math.floor(sum) : "";
};

export { sumMatchedBets };