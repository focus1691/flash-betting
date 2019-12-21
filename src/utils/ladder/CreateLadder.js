import { formatPriceKey, calcBackLayPercentages } from "./CreateFullLadder";
import { sortAsc, sortDes } from "../Algorithms/Sort";

const CreateLadder = (data) => {
  const runner = data;

  runner.id = data.id;
  runner.ltp = runner.ltp ? [runner.ltp] : [null];
  runner.ltpDelta = new Date();
  runner.tv = runner.tv ? [runner.tv, runner.tv] : [null, null];
  runner.atbo = {};
  runner.atlo = {};

  runner.order = {
    visible: false,
    backLay: 0,
    stakeLiability: 0,
    stake: 2,
    price: 0
  };

  // make it easier for ladder
  runner.trdo = {};
  if (!runner.trd) {
    runner.trd = [];


  } else {
    sortAsc(runner.trd);

    runner.trd.map(trd => {
      runner.trdo[formatPriceKey(trd[0])] = trd[1]
    })
  }

  if (!runner.atb) {
    runner.atb = [];
  } else {
    sortDes(runner.atb);

    for (var i = 0; i < runner.atb.length; i++) {

      let price = formatPriceKey(runner.atb[i][0]);
      const matched = Math.floor(runner.atb[i][1]);

      if (matched <= 0) {
        runner.atb.splice(i, 1);
        i--;
      } else {

        // Alter the value to round down
        runner.atb[i][1] = matched;

        runner.atlo[price] = matched;
      }
    }
  }

  if (!runner.atl) {
    runner.atl = [];
  } else {
    sortAsc(runner.atl);

    for (i = 0; i < runner.atl.length; i++) {

      let price = formatPriceKey(runner.atl[i][0]);
      const matched = Math.floor(runner.atl[i][1]);

      if (matched <= 0) {
        runner.atl.splice(i, 1);
        i--;
      } else {

        // Alter the value to round down
        runner.atl[i][1] = matched;

        runner.atbo[price] = matched;
      }
    }
  }

  runner.percent = calcBackLayPercentages(runner.atbo, runner.atlo, runner.ltp[0]);

  return runner;
};

export { CreateLadder };