export default ((unmatchedBetsOnRow) => {
  if (unmatchedBetsOnRow) {
    return unmatchedBetsOnRow.reduce((acc, bet) => parseFloat(acc) + parseFloat(bet.size), 0);
  }
  return 0;
});
