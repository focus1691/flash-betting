import { createFullLadder, formatPriceKey } from "./CreateFullLadder";

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

  if (runner.atb) {
    for (var i = 0; i < runner.atb.length; i++) {
      let priceKey = formatPriceKey(runner.atb[i][0]);
      runner.fullLadder[priceKey].odds = priceKey;
      runner.fullLadder[priceKey].backMatched = runner.atb[i][1];
    }
  }
  if (runner.atl) {
    for (i = 0; i < runner.atl.length; i++) {
      let priceKey = formatPriceKey(runner.atl[i][0]);
      runner.fullLadder[priceKey].odds = priceKey;
      runner.fullLadder[priceKey].layMatched = runner.atl[i][1];
    }
  }
  return runner;
};

export { AddRunner };
