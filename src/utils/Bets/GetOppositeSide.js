const getOppositeSide = (side) => {
  if (side === 'BACK') return 'LAY';
  if (side === 'LAY') return 'BACK';
  return 'BACK';
};

export { getOppositeSide };
