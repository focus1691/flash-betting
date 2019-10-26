const selectionHasBets = (marketId, selectionId, bets) => {
    let selectionBets = Object.values(bets.matched)
        .filter(bet => bet.marketId === marketId && bet.selectionId == selectionId);

    return Object.values(selectionBets).length > 0;
};

export { selectionHasBets };