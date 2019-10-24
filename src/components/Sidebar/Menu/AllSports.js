import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/sport";
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
    mapMarkets = data => data
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
      `/api/${api}?sportId=${sportId}&&country=${country}&&competitionId=${competition}&&eventId=${event}`
    );
    const data = await response.json();

    const newSport = Object.assign({}, props.sports.currentSport);

    newSport[currentMarket] = marketSelection;
    newSport[marketList] = mapMarkets(data);
    props.onUpdateCurrentSport(newSport);

    return data;
  };

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

  console.log(props.sports.currentSport);

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
                  name={currentEvent.name}
                  markets={eventMarkets}
                  handleClick={handleClick}
                  event={currentEvent}
                />
                : // Selecting Event
                currentCountry !== undefined &&
                  competitionEvents !== undefined &&
                  competitionEvents.length > 0 &&
                  currentEvent === undefined ?
                  <SelectEvent
                    currentCompetition={currentCompetition}
                    currentCountry={currentCountry}
                    competitionEvents={competitionEvents}
                    handleClick={handleClick}
                  />
                  : // Selecting Competition
                  currentCountry !== undefined &&
                    countryCompetitions !== undefined &&
                    countryCompetitions.length > 0 &&
                    currentEvent === undefined ?
                    <SelectCompetition
                      country={currentCountry}
                      competitions={countryCompetitions}
                      handleClick={handleClick}
                      currentSportId={currentSportId}
                    />
                    : // Selecting Sport
                    <SelectSport
                      sports={props.sports}
                      currentSportId={currentSportId}
                      countries={sportCountries}
                      handleClick={handleClick}
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
    currentSport: state.currentSport
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReceiveAllSports: sports => dispatch(actions.setAllSports(sports)),
    onUpdateCurrentSport: sport => dispatch(actions.setCurrentSport(sport))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AllSports);