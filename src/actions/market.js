export const setMarketStatus = isOpen => {
  return {
    type: "NEW_MARKET_STATUS",
    payload: isOpen
  }
}

export const loadMarket = market => {
  return {
    type: "LOAD_MARKET",
    payload: market
  };
};

export const loadLadder = ladder => {
  return {
    type: "LOAD_LADDER",
    payload: ladder
  };
};

export const loadRunners = runners => {
  return {
    type: "LOAD_RUNNERS",
    payload: runners
  };
};

export const updateExcludedLadders = ladders => {
  return {
    type: "EXCLUDE_LADDERS",
    payload: ladders
  };
};

export const updateLadderOrder = orderList => {
  return {
    type: "UPDATE_LADDER_ORDER",
    payload: orderList
  };
};

export const setRunner = runner => {
  return {
    type: "SELECT_RUNNER",
    payload: runner
  };
};

export const toggleOneClick = active => {
    return {
        type: "TOGGLE_ONE_CLICK",
        payload: active
    }
}

export const updateOrder = order => {
  return {
    type: "UPDATE_ORDER",
    payload: order
  };
};

export const updateOrderValue = val => {
    return {
        type: "UPDATE_ORDER_VALUE",
        payload: val
    }
};

export const updateOrderPrice = price => {
  return {
    type: "UPDATE_ORDER_PRICE",
    payload: price
  };
};

export const toggleStakeAndLiability = val => {
  return {
    type: "TOGGLE_STAKE_AND_LIABILITY",
    payload: val
  };
};

export const toggleBackAndLay = val => {
    return {
        type: "TOGGLE_BACK_AND_LAY",
        payload: val
    }
};

export const toggleVisibility = settings => {
  return {
    type: "TOGGLE_ORDER_VISIBILITY",
    payload: settings
  };
};

export const changePriceType = priceType => { // stake and liability
  return {
    type: "SWITCH_PRICE_TYPE",
    payload: priceType
  };
};

