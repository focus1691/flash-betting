/**
 * This function is used to deconstruct the ladder data when mapping through ladders
 * @param {object} ladder - Ladder information for a runner
 * @return {data} The deconstructed ladder
 */
const DeconstructLadder = ladder => {

  if (ladder === null || ladder === undefined) {
    return {
      ltp: [null, null],
      tv: 0,
      color: "#FFFFFF",
      atb: {},
      atl: {},
      ltpStyle: { background: "#FFF", color: "#000" }
    }
  } else {
    return {
      ltp: ladder.ltp ? ladder.ltp : [null, null],
      tv: ladder.tv ? ladder.tv : null,
      color: "#FFFFFF",
      ltpStyle: getLTPstyle(ladder.ltp, ladder.ltpDelta),
      atb: ladder.atb || {},
      atl: ladder.atl || {},
    }
  }
};

const getLTPstyle = (ltp, ltpDelta) => {
  if (ltp === null || ltp === undefined || ltp[0] === null || ltp[0] === undefined) {
    return { background: "#FFF", color: "#000" };
  }
  
  else if (ltp[0] < ltp[1]) {
    return { background: "#FC0700", color: "#FFFF00" } // #FC0700 (Red Lower LTP)
  }
  else if (ltp[0] > ltp[1]) {
    return { background: "#0AFD03", color: "#000" } // #0AFD03 (Green Higher LTP)
  }
  else if (ltp[0]) {
    return { background: "#FFFF00", color: "#000" } // #FFFF00 (Yellow Same LTP)
  } else {
    return { background: "#FFF", color: "#000" }; // #FFF (No Value)
  }
};

export { DeconstructLadder, getLTPstyle };