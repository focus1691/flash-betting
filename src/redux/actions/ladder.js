export const updateExcludedLadders = (ladders) => ({
  type: 'EXCLUDE_LADDERS',
  payload: ladders,
});

export const updateLadderOrder = (orderList) => ({
  type: 'UPDATE_LADDER_ORDER',
  payload: orderList,
});

export const setBackLayColOrder = (layFirstCol) => ({
  type: 'SET_BACK_LAY_COL_LADDER_ORDER',
  payload: layFirstCol,
});

export const setOddsHovered = (odds) => ({
  type: 'SET_ODDS_HOVERED',
  payload: odds,
});

export const changePriceType = (
  priceType,
) => ({
  type: 'SWITCH_PRICE_TYPE',
  payload: priceType,
});

export const setMarketPL = (pl) => ({
  type: 'SET_MARKET_PL',
  payload: pl,
});

export const setDraggingLadder = (draggingLadder) => ({
  type: 'SET_DRAGGING_LADDER',
  payload: draggingLadder,
});
