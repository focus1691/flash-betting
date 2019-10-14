import { createFullLadder, formatPriceKey, calcBackLayPercentages } from "./CreateFullLadder";
import { sortAsc, sortDes } from "../Algorithms/Sort";

const AddRunner = (key, data) => {
  const runner = data;
  runner.ltp = [runner.ltp, runner.ltp];
  runner.tv = [runner.tv, runner.tv];
  runner.fullLadder = createFullLadder();

  runner.order = {
    visible: false,
    backLay: 0,
    stakeLiability: 0,
    stake: 2,
    price: 0
  };

  sortDes(runner.atb);
  sortAsc(runner.atl);

  if (runner.atb) {
    for (var i = 0; i < runner.atb.length; i++) {

      let price = formatPriceKey(runner.atb[i][0]);
      const matched = Math.floor(runner.atb[i][1]);

      if (matched <= 0) {
        runner.atb.splice(i, 1);
        i--;
      } else {
        // Update the values in the full ladder: 1.01 - 1000
        runner.fullLadder[price].odds = price;
        runner.fullLadder[price].backMatched = matched;

        // Alter the value to round down
        runner.atb[i][1] = matched;
      }
    }
  }
  if (runner.atl) {
    for (i = 0; i < runner.atl.length; i++) {

      let price = formatPriceKey(runner.atl[i][0]);
      const matched = Math.floor(runner.atl[i][1]);

      if (matched <= 0) {
        runner.atl.splice(i, 1);
        i--;
      } else {
        // Update the values in the full ladder: 1.01 - 1000
        runner.fullLadder[price].odds = price;
        runner.fullLadder[price].layMatched = matched;

        // Alter the value to round down
        runner.atl[i][1] = matched;
      }
    }
  }
  runner.percent = calcBackLayPercentages(runner.fullLadder, runner.ltp[0]);
  return runner;
};

export { AddRunner };
