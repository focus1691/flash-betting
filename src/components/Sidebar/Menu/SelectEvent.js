import React from "react";
import SportsClickList from "./SportsClickList";

export default ({ currentCompetition, currentCountry, competitionEvents, handleClick }) => (
    <SportsClickList
        currentItem={
            currentCompetition !== undefined
                ? currentCompetition.name
                : currentCountry
        }
        newArray={competitionEvents}
        currentItemName={
            currentCompetition !== undefined
                ? "currentCompetition"
                : "currentCountry"
        }
        newArrayName={"competitionEvents"}
        listSelector={"name"}
        reverseClickHandler={handleClick}
        clickHandler={data =>
            handleClick(
                data,
                "currentEvent",
                "eventMarkets",
                "list-markets",
                "",
                "",
                "",
                data.id,
                data => data.result
            )
        }
        currentItemFull={
            currentCompetition !== undefined
                ? currentCompetition
                : currentCountry
        }
    />
);