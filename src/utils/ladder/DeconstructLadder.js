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

const getLTPstyle = (ltp, ltpDelta) => {
  if (ltp === null || ltp === undefined || ltp[0] === null || ltp[0] === undefined) {
    return { background: '#FFF', color: '#000' };
  }

  if (ltp[0] < ltp[1]) {
    return { background: '#FC0700', color: '#d3d44f' }; // #FC0700 (Red Lower LTP)
  }
  if (ltp[0] > ltp[1]) {
    return { background: '#0AFD03', color: '#000' }; // #0AFD03 (Green Higher LTP)
  }
  if (ltp[0]) {
    return { background: '#d3d44f', color: '#000' }; // #d3d44f (Yellow Same LTP)
  }
  return { background: '#FFF', color: '#000' }; // #FFF (No Value)
};

export { DeconstructLadder, getLTPstyle };
