export const setAllSports = (sports) => ({
  type: 'SPORTS_LIST',
  payload: sports,
});

export const updateSubmenuList = (submenu) => ({
  type: 'UPDATE_SUBMENU_LIST',
  payload: submenu,
});

export const updateSubmenuListMyMarkets = (submenu) => ({
  type: 'UPDATE_SUBMENU_LIST_MYMARKETS',
  payload: submenu,
});

export const updateCurrentSubmenu = (submenu) => ({
  type: 'UPDATE_SUBMENU_CURRENT',
  payload: submenu,
});

export const updateSubmenuMyMarkets = (submenu) => ({
  type: 'UPDATE_SUBMENU_CURRENT_MYMARKETS',
  payload: submenu,
});

export const setCurrentSport = (sport) => ({
  type: 'SPORTS_CURRENT',
  payload: sport,
});

export const setCurrentMarket = (market) => ({
  type: 'CURRENT_MARKET',
  payload: market,
});
