const getLTPstyle = (ltp, ltpDelta) => {
  if (ltp === null || ltp === undefined || ltp[0] === null || ltp[0] === undefined) {
    return { background: '#FFF', color: '#000' };
  }

  if (ltp[0] < ltp[1]) {
    return { background: '#BD2B32', color: '#d3d44f' }; // #BD2B32 (Red Lower LTP)
  }
  if (ltp[0] > ltp[1]) {
    return { background: '#0BBF63', color: '#121212' }; // #0BBF63 (Green Higher LTP)
  }
  if (ltp[0]) {
    return { background: '#d3d44f', color: '#121212' }; // #d3d44f (Yellow Same LTP)
  }
  return { background: '#FFF', color: '#121212' }; // #FFF (No Value)
};

/**
 * This function is used to deconstruct the ladder data when mapping through ladders
 * @param {object} ladder - Ladder information for a runner
 * @return {data} The deconstructed ladder
 */
const DeconstructLadder = (ladder) => {
  if (ladder === null || ladder === undefined) {
    return {
      ltp: [null, null],
      tv: 0,
      color: '#FFFFFF',
      atb: {},
      atl: {},
      ltpStyle: { background: '#FFF', color: '#000' },
    };
  }
  return {
    ltp: ladder.ltp ? ladder.ltp : [null, null],
    tv: ladder.tv ? ladder.tv : null,
    color: '#FFFFFF',
    ltpStyle: getLTPstyle(ladder.ltp, ladder.ltpDelta),
    atb: ladder.atb || {},
    atl: ladder.atl || {},
  };
};

export { DeconstructLadder, getLTPstyle };
