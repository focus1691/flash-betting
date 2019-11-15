const getOppositeSide = side => {
  if (side === "BACK") return "LAY";
  else if (side === "LAY") return "BACK";
  return null;
}

export { getOppositeSide };