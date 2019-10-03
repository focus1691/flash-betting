
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


  data.bg =
    data.ltp[0] < data.ltp[1] // #0AFD03 (Green Lower LTP)
      ? "#0AFD03"
      : data.ltp[0] > data.ltp[1] // #FC0700 (Red Higher LTP)
        ? "#FC0700"
        : data.ltp[0] === data.ltp[1] // #FFFF00 (Yellow Same LTP)
          ? "#FFFF00"
          : "#FFF" // #FFF (No Value)

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

export { DeconstructLadder };
