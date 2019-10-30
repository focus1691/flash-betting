import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/sport";
import { loadMyMarkets } from "../../../actions/market";
import List from "@material-ui/core/List";
import SelectSport from "./SelectSport";
import SelectCompetition from "./SelectCompetition";
import SelectEvent from "./SelectEvent";
import SelectMarket from "./SelectMarket";

const AllSports = props => {
  useEffect(() => {
    fetch(`/api/get-all-sports`)
      .then(res => res.json())
      .then(sports => {
        sports.push({eventType: {id: "TC-7", name: "Horse Racing - Today's Card"}})
        sports.push({eventType: {id: "TC-4339", name: "Greyhound Racing - Today's Card"}})
        
        sports.sort((a, b) => {
          var nameA = a.eventType.name.toLowerCase(), nameB = b.eventType.name.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        });

        props.onReceiveAllSports(sports);
      });
  }, []);

  const handleClick = async (
    marketSelection,
    currentMarket,
    marketList,
    api,
    sportId = "",
    country = "",
    competition = "",
    event = "",
    mapMarkets = data => data,
    sortMarkets = data => data
  ) => {
    /*
			marketSelection - button click
			currentMarket - key for the market that is currently selected
			marketList - key for array that is associated with the market (we can also use this to reset an array associated with the marketSelection)
			api - where we should fetch
			sports, country, competition, event - api information,
			mapMarkets - map the data we get from the api call
    */

    // set back to undefined if they don't want to see the menu anymore, click on the same button another time
    if (props.sports.currentSport[currentMarket] === marketSelection) {
      const newSport = Object.assign({}, props.sports.currentSport);

      newSport[currentMarket] = undefined;
      newSport[marketList] = undefined;

      props.onUpdateCurrentSport(newSport);
      return;
    }

    

    const response = await fetch(
      `/api/${api}?sportId=${sportId}&&winMarketsOnly=${props.winMarketsOnly}&&country=${country}&&competitionId=${competition}&&eventId=${event}`
    );
    const data = await response.json();
    const newSport = Object.assign({}, props.sports.currentSport);
    
    newSport[currentMarket] = marketSelection;
    newSport[marketList] = sortMarkets(mapMarkets(data));
    props.onUpdateCurrentSport(newSport);

    return data;
  };


  const updateMyMarkets = (action, id, name, sportId, type, country) => {
    /*
			myMarkets - myMarkets that will be edited
			action - add to my markets, or remove
			id - id for the selection
			name - name displayed on myMarkets
			sportId - the sport that the selection is associated with
      type - the type of the selection (sport, country, competition, event, market)
      currentCountry - the currentCountry, only applies to (country, competition, event) for lookup purposes
    */
    const marketSelection = {id, name, sportId, type, country};
    
    fetch(`/api/${action == "add" ? 'save-market' : 'remove-market'}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(marketSelection)
    })
    .then(res => res.json())
    .then(res => {
      props.onUpdateMyMarkets(res)
    })
    .catch(res => {})
    
  }

  const {
    currentSportId,
    sportCountries,
    currentCountry,
    countryCompetitions,
    currentCompetition,
    competitionEvents,
    currentEvent,
    eventMarkets
  } = props.sports.currentSport;
  
  return (
    <div>
      <table id="all-sports">
        <tbody>
          <List>
            {// Selecting Market
              currentEvent !== undefined &&
                eventMarkets !== undefined &&
                eventMarkets.length > 0 ?
                <SelectMarket
                  currentSportId={currentSportId}
                  name={currentEvent.name}
                  markets={eventMarkets.sort((a, b) => a.marketName.localeCompare(b.marketName))}
                  handleClick={handleClick}
                  event={currentEvent}
                  myMarkets = {props.myMarkets}
                  updateMyMarkets = {updateMyMarkets}
                />
                : // Selecting Event
                currentCountry !== undefined &&
                  competitionEvents !== undefined &&
                  competitionEvents.length > 0 &&
                  currentEvent === undefined ?
                  <SelectEvent
                    currentSportId={currentSportId}
                    currentCompetition={currentCompetition}
                    currentCountry={currentCountry}
                    competitionEvents={competitionEvents.sort((a, b) => Date.parse(a.openDate) - Date.parse(b.openDate) || a.name.localeCompare(b.name))}
                    handleClick={handleClick}
                    myMarkets = {props.myMarkets}
                    updateMyMarkets = {updateMyMarkets}
                  />
                  : // Selecting Competition
                  currentCountry !== undefined &&
                    countryCompetitions !== undefined &&
                    countryCompetitions.length > 0 &&
                    currentEvent === undefined ?
                    <SelectCompetition
                      currentCountry={currentCountry}
                      competitions={countryCompetitions}
                      handleClick={handleClick}
                      currentSportId={currentSportId}
                      myMarkets = {props.myMarkets}
                      updateMyMarkets = {updateMyMarkets}
                    />
                    : // Selecting Sport
                    <SelectSport
                      sports={props.sports}
                      currentSportId={currentSportId}
                      countries={sportCountries}
                      handleClick={handleClick}
                      myMarkets = {props.myMarkets}
                      updateMyMarkets = {updateMyMarkets}
                    />
            }
          </List>
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    sports: state.sports,
    currentSport: state.currentSport,
    myMarkets: state.market.myMarkets,
    winMarketsOnly: state.settings.winMarketsOnly
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReceiveAllSports: sports => dispatch(actions.setAllSports(sports)),
    onUpdateCurrentSport: sport => dispatch(actions.setCurrentSport(sport)),
    onUpdateMyMarkets: markets => dispatch(loadMyMarkets(markets))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllSports);