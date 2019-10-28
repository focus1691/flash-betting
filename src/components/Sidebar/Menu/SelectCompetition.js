import React from "react";
import SportsClickList from "./SportsClickList";

export default ({ currentCountry, competitions, handleClick, currentSportId, myMarkets, updateMyMarkets}) => {
  const updateMyMarketCompetitions = (marketItemSaved, id, name, sportId) => updateMyMarkets(marketItemSaved ? 'sub' : 'add', id, name, sportId, "Competition")
  return (
    <SportsClickList
      currentItem={currentCountry}
      newArray={competitions}
      currentItemName={"currentCountry"}
      newArrayName={"countryCompetitions"}
      listSelector={"name"}
      reverseClickHandler={handleClick}
      myMarkets={myMarkets}
      idSelector={"id"}
      currentSportId={currentSportId}
      clickHandler={data =>
        handleClick(
          data,
          "currentCompetition",
          "competitionEvents",
          "list-competition-events",
          currentSportId,
          currentCountry,
          data.id,
          "",
          data => data.map(item => item.event)
        )
      }
      updateMyMarkets = {updateMyMarketCompetitions}
    />
  )
};