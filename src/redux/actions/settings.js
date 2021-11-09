export const setDefaultView = (view) => ({
  type: 'SET_DEFAULT_VIEW',
  payload: view,
});

export const setActiveView = (view) => ({
  type: 'ACTIVE_VIEW',
  payload: view,
});

export const setIsLoading = (isLoading) => ({
  type: 'SET_LOADING',
  payload: isLoading,
});

export const openPremiumDialog = (open) => ({
  type: 'TOGGLE_POPUP',
  payload: open,
});

export const setPremiumStatus = (isPremium) => ({
  type: 'SET_PREMIUM_STATUS',
  payload: isPremium,
});

export const setFullscreen = (fullscreenSelected) => ({
  type: 'FULL_SCREEN',
  payload: fullscreenSelected,
});

export const toggleLadderColourContrast = (isSelected) => ({
  type: 'TOGGLE_LADDER_COLOUR_CONTRAST',
  payload: isSelected,
});

export const toggleSound = (isSelected) => ({
  type: 'TOGGLE_SOUNDS',
  payload: isSelected,
});

export const toggleTools = (settings) => ({
  type: 'TOGGLE_TOOLS',
  payload: settings,
});

export const toggleUnmatchedBets = (settings) => ({
  type: 'TOGGLE_UNMATCHED_BETS',
  payload: settings,
});

export const toggleMatchedBets = (settings) => ({
  type: 'TOGGLE_MATCHED_BETS',
  payload: settings,
});

export const toggleProfitAndLoss = (settings) => ({
  type: 'TOGGLE_PROFIT_AND_LOSS',
  payload: settings,
});

export const toggleProjectedSP = (settings) => ({
  type: 'TOGGLE_PROJECTED_SP',
  payload: settings,
});

export const toggleGraph = (settings) => ({
  type: 'TOGGLE_GRAPH',
  payload: settings,
});

export const toggleMarketInformation = (settings) => ({
  type: 'TOGGLE_MARKET_INFORMATION',
  payload: settings,
});

export const setWinMarketsOnly = (isChecked) => ({
  type: 'SET_WIN_MARKETS',
  payload: isChecked,
});

export const toggleRules = (settings) => ({
  type: 'TOGGLE_RULES',
  payload: settings,
});

export const toggleLadderUnmatched = (unmatchedColumn) => ({
  type: 'TOGGLE_LADDER_UNMATCHED_COLUMN',
  payload: unmatchedColumn,
});

export const setStakeBtns = (buttons) => ({
  type: 'SET_STAKE_BUTTONS',
  payload: buttons,
});

export const setLayBtns = (buttons) => ({
  type: 'SET_LAY_BUTTONS',
  payload: buttons,
});

export const updateStakeBtn = (data) => ({
  type: 'UPDATE_STAKE_BUTTON',
  payload: data,
});

export const updateLayBtn = (data) => ({
  type: 'UPDATE_LAY_BUTTON',
  payload: data,
});

export const setStake = (stake) => ({
  type: 'SET_STAKE',
  payload: stake,
});

export const setStakeInOneClick = (data) => ({
  type: 'SET_STAKE_IN_ONE_CLICK_MODE',
  payload: data,
});

export const updateRightClickTicks = (ticks) => ({
  type: 'SET_RIGHT_CLICK_TICKS',
  payload: ticks,
});

export const setHorseRacingCountries = (horseRaces) => ({
  type: 'SET_HORSE_RACE_COUNTRIES',
  payload: horseRaces,
});

/** ****** Market panels in sidebar ******* */

export const setLaddersExpanded = (expanded) => ({
  type: 'SET_LADDERS_EXPANDED',
  payload: expanded,
});

export const setToolsExpanded = (expanded) => ({
  type: 'SET_TOOLS_EXPANDED',
  payload: expanded,
});

export const setUnmatchedBetsExpanded = (expanded) => ({
  type: 'SET_UNMATCHED_BETS_EXPANDED',
  payload: expanded,
});

export const setMatchedBetsExpanded = (expanded) => ({
  type: 'SET_MATCHED_BETS_EXPANDED',
  payload: expanded,
});

export const setGraphExpanded = (expanded) => ({
  type: 'SET_GRAPHS_EXPANDED',
  payload: expanded,
});

export const setMarketInfoExpanded = (expanded) => ({
  type: 'SET_MARKET_INFO_EXPANDED',
  payload: expanded,
});

export const setRulesExpanded = (expanded) => ({
  type: 'SET_RULES_EXPANDED',
  payload: expanded,
});

export const setDrawerOpen = (isOpen) => ({
  type: 'SET_DRAWER_OPEN',
  payload: isOpen,
});
