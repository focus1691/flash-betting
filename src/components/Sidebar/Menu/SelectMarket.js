import React from "react";
import SportsClickList from "./SportsClickList";
import { ListItem, ListItemText } from "@material-ui/core";
import CountryCodeConverter from '../../../utils/CountryCodeConverter'

export default ({name, markets, handleClick, event, myMarkets, currentSportId, updateMyMarkets, currentCountry, currentCompetition, sports}) => {
  const updateMyMarketMarkets = (marketItemSaved, id, name, sportId) => updateMyMarkets(marketItemSaved ? 'sub' : 'add', id, name, sportId, "Market")
  const previousSport = sports.sports.find(item => parseInt(item.eventType.id) === parseInt(currentSportId))
  return (
    <React.Fragment>
      <React.Fragment>
          <ListItem
          button
          onClick={async e =>
              {
                  await handleClick(currentCountry, "currentCountry", null, '', '', '', '', '', '', '', 
                          [currentCompetition !== undefined ? "currentCompetition" : null, 'competitionEvents', 'countryCompetitions', 'currentEvent']); // extra things to remove 
                  
              }
          } 
          >
              <ListItemText>{previousSport ? previousSport.eventType.name : null }</ListItemText>
          </ListItem>
      </React.Fragment>
      <React.Fragment>
          <ListItem
          button
          onClick={e => 
              handleClick(currentCompetition !== undefined ? currentCompetition : null, 
                  currentCompetition !== undefined ? "currentCompetition" : null,
                  currentCompetition !== undefined ? "competitionEvents" : "countryCompetitions", '', '', '', '', '', '', '',  ['currentEvent'])
          } 
          >
              <ListItemText>{CountryCodeConverter(currentCountry)}</ListItemText>
          </ListItem>
      </React.Fragment>
      <React.Fragment>
          <ListItem
          button
          onClick={e => 
              handleClick(event, "currentEvent", "eventMarkets", '', '', '', '', '', '', '')
          } 
          >
              <ListItemText>{currentCompetition ? currentCompetition.name : name}</ListItemText>
          </ListItem>
      </React.Fragment>
    <SportsClickList
      previousItem={currentCompetition ? currentCompetition.name : name}
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
    </React.Fragment>
  );
}