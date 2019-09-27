import { sortAsc, sortDes } from "../Sort";

const DeconstructLadder = ladder => {
  const data = {
    ltp: ladder.ltp,
    tv: ladder.tv
  };

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
