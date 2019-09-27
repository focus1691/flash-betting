import { createFullLadder, formatPriceKey } from "./CreateFullLadder";
import { sortAsc, sortDes } from "../Sort";

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

      } else {
        // Update the values in the full ladder: 1.01 - 1000
        runner.fullLadder[price].odds = price;
        runner.fullLadder[price].backMatched = runner.atb[i][1];

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

      } else {
        // Update the values in the full ladder: 1.01 - 1000
        runner.fullLadder[price].odds = price;
        runner.fullLadder[price].backMatched = runner.atl[i][1];

        // Alter the value to round down
        runner.atl[i][1] = matched;
      }
    }
  }
  return runner;
};

export { AddRunner };
