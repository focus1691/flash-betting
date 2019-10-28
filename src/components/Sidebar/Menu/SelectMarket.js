import React from "react";
import SportsClickList from "./SportsClickList";

export default ({name, markets, handleClick, event, myMarkets, currentSportId, updateMyMarkets}) => {
  const updateMyMarketMarkets = (marketItemSaved, id, name, sportId) => updateMyMarkets(marketItemSaved ? 'sub' : 'add', id, name, sportId, "Market")
  return (
    <SportsClickList
      currentItem={name}
      newArray={markets}
      currentItemName={"currentEvent"}
      newArrayName={"eventMarkets"}
      listSelector={"marketName"}
      reverseClickHandler={handleClick}
      clickHandler={market => window.open(`/dashboard?marketId=${market.marketId}`)}
      currentItemFull={event}
      myMarkets={myMarkets}
      idSelector={"marketId"}
      currentSportId={currentSportId}
      updateMyMarkets = {updateMyMarketMarkets}
    />
  );
}