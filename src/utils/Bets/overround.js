import _ from 'lodash';

export default (ladders) => {
  const overround = {
    back: 0,
    lay: 0,
  }
  Object.values(ladders).forEach(ladder => {
    const allBackPrices = Object.keys(ladder.atlo);
    const allLayPrices = Object.keys(ladder.atbo);

    const batb = _.isEmpty(allBackPrices) ? 0 : Math.max(...allBackPrices);
    const batl = _.isEmpty(allLayPrices) ? 0 : Math.min(...allLayPrices);

    overround.back += 100 / batb;
    overround.lay += 100 / batl;
  });
  overround.back = overround.back.round(2);
  overround.lay = overround.lay.round(2);
  return overround;
};
