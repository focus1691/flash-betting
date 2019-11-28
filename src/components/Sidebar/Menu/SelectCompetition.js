import React from "react";
import SportsClickList from "./SportsClickList";
import { ListItem, ListItemText } from "@material-ui/core";

export default ({ sports, currentCountry, competitions, handleClick, currentSportId, myMarkets, updateMyMarkets}) => {
  const updateMyMarketCompetitions = (marketItemSaved, id, name, sportId) => updateMyMarkets(marketItemSaved ? 'sub' : 'add', id, name, sportId, "Competition")
  
  const previousSport = sports.sports.find(item => parseInt(item.eventType.id) === parseInt(currentSportId))
  return (
    <React.Fragment>
      <React.Fragment>
        <ListItem
          button
          onClick={e =>
            handleClick(currentCountry, "currentCountry", null)
          } 
        >
          <ListItemText>{previousSport ? previousSport.eventType.name : null }</ListItemText>
        </ListItem>
      </React.Fragment>
      <SportsClickList
        previousItem={previousSport ? previousSport.eventType.name : null}
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
    </React.Fragment>
  )
};