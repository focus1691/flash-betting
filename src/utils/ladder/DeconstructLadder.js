
/**
 * This function is used to deconstruct the ladder data when mapping through ladders
 * @param {object} ladder - Ladder information for a runner
 * @return {data} The deconstructed ladder
 */
const DeconstructLadder = ladder => {
  const data = {
    ltp: ladder.ltp ? ladder.ltp : [null, null],
    tv: ladder.tv ? ladder.tv : null,
    color: "#FFFFFF"
  };
  
  data.ltpStyle = getLTPstyle(data.ltp, ladder.ltpDelta);

  if (ladder.atb) {
    data.atb = ladder.atb;
  }
  if (ladder.atl) {
    data.atl = ladder.atl;
  }
  if (ladder.batb) {
    data.batb = ladder.batb;
  }
  if (ladder.batl) {
    data.batl = ladder.batl;
  }
  return data;
};

const getLTPstyle = (ltp, ltpDelta) => {
  let now = new Date().getTime();

  if (ltp[0] < ltp[1] && now - ltpDelta.getTime() < 2000) {
    return { background: "#0AFD03", color: "#000" };
  }
  else if (ltp[0] > ltp[1] && now - ltpDelta.getTime() < 2000) {
    return { background: "#FC0700", color: "#FFFF00" };
  }
  else if (ltp[0]) {
    return { background: "#FFFF00", color: "#000" };
  } else {
    return { background: "#FFF", color: "#000" };
  }
};

export { DeconstructLadder, getLTPstyle };
