import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/sport";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";
import SportsFilterList from "./SportsFilterList";
import SportsClickList from "./SportsClickList";

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
    result,
    currentObjectSelector,
    currentObjectArraySelector,
    api,
    sportId = "",
    country = "",
    competition = "",
    event = "",
    dataFormatter = data => data
  ) => {
    /*
			result - button click
			currentObjectSelector - variable that is associated with result
			currentObjectArraySelector - array that is associated with result (we can also use this to reset an array associated with the result)
			api - where we should fetch
			sports, country, competition, event - api information,
			dataFormatter - formats the data we get from the api
		*/

    // set back to undefined if they don't want to see the menu anymore, click on the same button another time
    if (props.sports.currentSport[currentObjectSelector] === result) {
      const newSport = Object.assign({}, props.sports.currentSport);

      newSport[currentObjectSelector] = undefined;
      newSport[currentObjectArraySelector] = undefined;

      props.onUpdateCurrentSport(newSport);
      return;
    }

    const response = await fetch(
      `/api/${api}?sportId=${sportId}&&country=${country}&&competitionId=${competition}&&eventId=${event}`
    );
    const data = await response.json();

    const newSport = Object.assign({}, props.sports.currentSport);

    newSport[currentObjectSelector] = result;
    newSport[currentObjectArraySelector] = dataFormatter(data);
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

  return (
    <div>
      <table id="all-sports">
        <tbody>
          <List>
            {// Selecting Market
              currentEvent !== undefined &&
                eventMarkets !== undefined &&
                eventMarkets.length > 0 ? (
                  <SportsClickList
                    currentItem={currentEvent.name}
                    newArray={eventMarkets}
                    currentItemName={"currentEvent"}
                    newArrayName={"eventMarkets"}
                    listSelector={"marketName"}
                    reverseClickHandler={handleClick}
                    clickHandler={market => window.open(`/dashboard?marketId=${market.marketId}`)}
                    currentItemFull={currentEvent}
                  />
                ) : // Selecting Event
                currentCountry !== undefined &&
                  competitionEvents !== undefined &&
                  competitionEvents.length > 0 &&
                  currentEvent === undefined ? (
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
                  ) : // Selecting Competition
                  currentCountry !== undefined &&
                    countryCompetitions !== undefined &&
                    countryCompetitions.length > 0 &&
                    currentEvent === undefined ? (
                      <SportsClickList
                        currentItem={currentCountry}
                        newArray={countryCompetitions}
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
                            currentCountry,
                            data.id,
                            "",
                            data => data.map(item => item.event)
                          )
                        }
                      />
                    ) : (
                      // Used for selecting sport and country
                      props.sports.sports.map(sport => {
                        // if we have a sport selected
                        if (
                          currentSportId !== undefined &&
                          sport.eventType.id !== currentSportId
                        ) {
                          return null;
                        }

                        return (
                          <React.Fragment>
                            <tr>
                              <ListItem
                                button
                                onClick={e =>
                                  handleClick(
                                    sport.eventType.id,
                                    "currentSportId",
                                    "sportCountries",
                                    "list-countries",
                                    sport.eventType.id
                                  )
                                }
                              >
                                <ListItemIcon>
                                  <img
                                    src={window.location.origin + "/icons/expand.png"}
                                    alt={"Expand"}
                                  />
                                </ListItemIcon>
                                <ListItemText>{sport.eventType.name}</ListItemText>
                              </ListItem>
                              <tr>
                                {currentSportId !== undefined &&
                                  sport.eventType.id === currentSportId ? (
                                    <SportsFilterList
                                      list={sportCountries}
                                      itemSelector={"countryCode"}
                                      clickHandler={async data => {
                                        const competitions = await handleClick(
                                          data.countryCode,
                                          "currentCountry",
                                          "countryCompetitions",
                                          "list-competitions",
                                          currentSportId,
                                          data.countryCode,
                                          "",
                                          "",
                                          data => data.map(item => item.competition)
                                        );

                                        if (competitions.length === 0) {
                                          await handleClick(
                                            data.countryCode,
                                            "currentCountry",
                                            "competitionEvents",
                                            "list-events",
                                            currentSportId,
                                            data.countryCode,
                                            "",
                                            "",
                                            data => data.map(item => item.event)
                                          );
                                        }
                                      }}
                                    />
                                  ) : null}
                              </tr>
                            </tr>
                            <Divider />
                          </React.Fragment>
                        );
                      })
                    )}
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
