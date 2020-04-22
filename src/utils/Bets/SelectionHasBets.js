const selectionHasBets = bets => {
    if (!bets) return false;
    return bets.length > 0;
};

export { selectionHasBets };