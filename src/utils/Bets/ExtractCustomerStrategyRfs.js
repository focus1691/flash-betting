export default (unmatchedBets) => {
  return Object.values(unmatchedBets).filter((bet) => bet.rfs && bet.rfs !== 'None').map(({ rfs }) => rfs);
};
