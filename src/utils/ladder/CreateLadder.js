import { sortAsc, sortDes } from '../Sort';
import { calcBackLayPercentages, formatPriceKey } from './CreateFullLadder';

const CreateLadder = (data) => {
  const runner = data;
  runner.id = data.id;
  runner.ltp = runner.ltp ? [runner.ltp] : [null];
  runner.ltpDelta = new Date();
  runner.tv = runner.tv ? [runner.tv, runner.tv] : [null, null];
  runner.atb = runner.atb || [];
  runner.atl = runner.atl || [];
  runner.atbo = {};
  runner.atlo = {};
  runner.trd = runner.trd || [];
  runner.trdo = {};
  runner.order = {
    visible: false,
    backLay: 0,
    stakeLiability: 0,
    stake: 2,
    price: 0,
  };

  // make it easier for ladder
  runner.trd.forEach((trd) => {
    runner.trdo[formatPriceKey(trd[0])] = trd[1];
  });

  for (let i = 0; i < runner.atb.length; i += 1) {
    const price = formatPriceKey(runner.atb[i][0]);
    const matched = Math.floor(runner.atb[i][1]);

    if (matched <= 0) {
      runner.atb.splice(i, 1);
      i -= 1;
    } else {
      // Alter the value to round down
      runner.atb[i][1] = matched;

      runner.atlo[price] = matched;
    }
  }

  for (let i = 0; i < runner.atl.length; i += 1) {
    const price = formatPriceKey(runner.atl[i][0]);
    const matched = Math.floor(runner.atl[i][1]);

    if (matched <= 0) {
      runner.atl.splice(i, 1);
      i -= 1;
    } else {
      // Alter the value to round down
      runner.atl[i][1] = matched;

      runner.atbo[price] = matched;
    }
  }

  sortAsc(runner.trd);
  sortDes(runner.atb);
  sortAsc(runner.atl);

  runner.percent = calcBackLayPercentages(
    runner.atbo,
    runner.atlo,
    runner.ltp[0],
  );

  return runner;
};

export { CreateLadder };
