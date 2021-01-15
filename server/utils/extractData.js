const _ = require('lodash');

const submenuVals = [
  'EVENT_TYPE',
  'GROUP',
  'GROUP_1',
  'EVENT',
  'RACE',
  'MARKET',
];

function getMarketData(data, storedMarkets, menuNumber) {
  if (menuNumber === 0) {
    console.log(storedMarkets[submenuVals[menuNumber]]);
    return getMarketData(data[storedMarkets[submenuVals[menuNumber]].id], storedMarkets, menuNumber + 1);
  }
  if (menuNumber > submenuVals.length - 1) {
    return data;
  }
  if (!storedMarkets[submenuVals[menuNumber]]) {
    return data;
  }
  const { children } = _.find(data, { 'id': storedMarkets[submenuVals[menuNumber]].id });
  if (children) {
    return getMarketData(children, storedMarkets, menuNumber + 1);
  }
  return data;
}

module.exports = { getMarketData };