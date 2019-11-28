import React from "react";
import SportsClickList from "./SportsClickList";
import { ListItem, ListItemText } from "@material-ui/core";
import CountryCodeConverter from '../../../utils/CountryCodeConverter'

export default ({ sports, currentCompetition, currentCountry, competitionEvents, handleClick, myMarkets, currentSportId, updateMyMarkets }) => {
    const updateMyMarketEvents = (marketItemSaved, id, name, sportId) => updateMyMarkets(marketItemSaved ? 'sub' : 'add', id, name, sportId, "Event", currentCountry)
    const previousSport = sports.sports.find(item => parseInt(item.eventType.id) === parseInt(currentSportId))
    return (
        <React.Fragment>
            <React.Fragment>
                <ListItem
                button
                onClick={async e =>
                    {
                        await handleClick(currentCountry, "currentCountry", null, '', '', '', '', '', '', '', 
                                [currentCompetition !== undefined ? "currentCompetition" : null, 'competitionEvents']); // extra things to remove 
                        
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
                    {
                        handleClick(currentCompetition !== undefined ? currentCompetition : null, 
                        currentCompetition !== undefined ? "currentCompetition" : null,
                        "competitionEvents")
                    }
                    
                } 
                >
                    <ListItemText>{CountryCodeConverter(currentCountry)}</ListItemText>
                </ListItem>
            </React.Fragment>
            <SportsClickList
                previousItem = {currentCompetition !== undefined
                        ? currentCompetition.name
                        : currentCountry}
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
                myMarkets={myMarkets}
                idSelector={"id"}
                currentSportId={currentSportId}
                currentItemFull={
                    currentCompetition !== undefined
                        ? currentCompetition
                        : currentCountry
                }
                updateMyMarkets = {updateMyMarketEvents}
            />
        </React.Fragment>
    )
};