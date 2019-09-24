import { sortAsc, sortDes } from "../Sort";

const DeconstructLadder = ladder => {
  const data = {
    ltp: ladder.ltp,
    tv: ladder.tv
  };

  if (ladder.atb) {
    data.atb = sortDes(ladder.atb);
  }
  if (ladder.atl) {
    data.atl = sortAsc(ladder.atl);
  }
  if (ladder.batb) {
    data.batb = sortDes(ladder.batb);
  }
  if (ladder.batl) {
    data.batl = sortAsc(ladder.batl);
  }

  return data;
};

export { DeconstructLadder };
