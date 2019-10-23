import React from "react";
import SportsClickList from "./SportsClickList";

export default ({name, markets, handleClick, event}) => (
    <SportsClickList
    currentItem={name}
    newArray={markets}
    currentItemName={"currentEvent"}
    newArrayName={"eventMarkets"}
    listSelector={"marketName"}
    reverseClickHandler={handleClick}
    clickHandler={market => window.open(`/dashboard?marketId=${market.marketId}`)}
    currentItemFull={event}
  />
);