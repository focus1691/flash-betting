import React from "react";
import SportsClickList from "./SportsClickList";

export default ({ country, competitions, handleClick, currentSportId }) => (
    <SportsClickList
    currentItem={country}
    newArray={competitions}
    currentItemName={"currentCountry"}
    newArrayName={"countryCompetitions"}
    listSelector={"name"}
    reverseClickHandler={handleClick}
    clickHandler={data =>
      handleClick(
        data,
        "currentCompetition",
        "competitionEvents",
        "list-competition-events",
        currentSportId,
        country,
        data.id,
        "",
        data => data.map(item => item.event)
      )
    }
  />
);