export const combinePartiallyMatchedBets = (bets) => Object.values(bets.unmatched).reduce(reduceUnmatchedSelections, []).concat(Object.values(bets.matched).reduce(reduceMatchedSelections, []));

function reduceMatchedSelections(acc, cur) {
  return acc.indexOf(cur.selectionId) === -1 ? acc.concat(cur.selectionId) : acc;
}

function reduceUnmatchedSelections(acc, cur) {
  return acc.indexOf(cur.selectionId) === -1 && cur.sizeMatched > 0 ? acc.concat(cur.selectionId) : acc;
}
