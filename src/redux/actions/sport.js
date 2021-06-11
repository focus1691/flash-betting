export const setAllSports = (sports) => ({
  type: 'SPORTS_LIST',
  payload: sports,
});

export const updateSubmenuList = (submenu) => ({
  type: 'UPDATE_SUBMENU_LIST',
  payload: submenu,
});

export const updateMyMarketsSubmenu = (submenu) => ({
  type: 'UPDATE_SUBMENU_LIST_MYMARKETS',
  payload: submenu,
});

export const addNewMarket = (market) => ({
  type: 'ADD_NEW_MARKET',
  payload: market,
});

export const removeMarket = (id) => ({
  type: 'REMOVE_MARKET',
  payload: id,
});
