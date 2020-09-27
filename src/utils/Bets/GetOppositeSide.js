const getOppositeSide = (side) => {
  if (side === 'BACK') return 'LAY';
  if (side === 'LAY') return 'BACK';
  return null;
};

export { getOppositeSide };
