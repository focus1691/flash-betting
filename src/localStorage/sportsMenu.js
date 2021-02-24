import _ from 'lodash';

export const setupStorage = () => {
  if (localStorage.getItem('myMarket') === null) {
    // do something
    // set an empty object for my markets if none found in storage
    localStorage.setItem('myMarket', JSON.stringify({}));
  }
};

export const addNewMarket = (market) => {
  if (_.isEmpty(market)) return;
  try {
    const myMarkets = JSON.parse(localStorage.getItem('myMarkets'));
    myMarkets[market.id] = market;
    localStorage.setItem('myMarkets', myMarkets);
  } catch (error) {
    localStorage.setItem('myMarket', JSON.stringify({}));
  }
};

export const removeMarket = (id) => {
  if (!id) return;
  try {
    const myMarkets = JSON.parse(localStorage.getItem('myMarkets'));
    delete myMarkets[id];
    localStorage.setItem('myMarkets', myMarkets);
  } catch (error) {
    console.error('Problem removing market');
  }
};
