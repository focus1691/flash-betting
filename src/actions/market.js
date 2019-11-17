export const setInPlay = inPlay => {
  return {
    type: "SET_IN_PLAY",
    payload: inPlay
  }
};

export const setInPlayTime = time => {
  return {
    type: "SET_IN_PLAY_TIME",
    payload: time
  }
};

export const setMarketStatus = status => {
  return {
    type: "NEW_MARKET_STATUS",
    payload: status
  }
}

export const loadMarket = market => {
  return {
    type: "LOAD_MARKET",
    payload: market
  };
};

export const setMarketVolume = volume => {
  return {
    type: "SET_MARKET_VOLUME",
    payload: volume
  };
};

export const loadLadder = ladder => {
  return {
    type: "LOAD_LADDER",
    payload: ladder
  };
};

export const setSortedLadder = sortedLadder => {
  return {
    type: "SET_SORTED_LADDER",
    payload: sortedLadder
  };
};

export const loadRunners = runners => {
  return {
    type: "LOAD_RUNNERS",
    payload: runners
  };
};

export const loadNonRunners = nonRunners => {
  return {
    type: "LOAD_NON_RUNNERS",
    payload: nonRunners
  }
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

export const loadMyMarkets = markets => {
  return {
    type: "LOAD_MY_MARKETS",
    payload: markets
  }
};

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

export const updateOrderPrice = ({price, id}) => {
  return {
    type: "UPDATE_ORDER_PRICE",
    payload: {price, id}
  };
};

export const toggleStakeAndLiability = ({val, id}) => {
  return {
    type: "TOGGLE_STAKE_AND_LIABILITY",
    payload: {stakeLiability: val, id}
  };
};

export const toggleBackAndLay = ({val, id}) => {
    return {
        type: "TOGGLE_BACK_AND_LAY",
        payload: {backLay: val, id}
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

