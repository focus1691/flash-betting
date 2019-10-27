import React from "react";
import SportsFilterList from "./SportsFilterList";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";

export default ({ sports, currentSportId, countries, handleClick, myMarkets }) => {

    return (
        // Used for selecting sport and country
        sports.sports.map(sport => {
            // if we have a sport selected
            if (
                currentSportId !== undefined &&
                sport.eventType.id !== currentSportId
            ) {
                return null;
            }


            const marketItemSaved = myMarkets.find(item => item.sport.type === "Sport" && item.sport.id == sport.eventType.id) !== undefined
            
            return (
                <React.Fragment>
                    <tr style={Object.assign({ paddingBottom: "2px", marginTop: '0.5em'}, 
                                 currentSportId === undefined ? {display: 'flex', flexDirection: 'row', height: "3em", marginLeft: '1rem', width: '100%'} : 
                                                                { display: 'flex', flexDirection: 'column'})}>
                        {currentSportId === undefined ?
                            <ListItemIcon style={{minWidth: '0px'}}>
                                <img
                                    src={window.location.origin + (marketItemSaved ? "/icons/rounded-remove-button.png" : "/icons/add-button-inside-black-circle.png") }
                                    alt={"Expand"}
                                    style = {{height: '16px', width: 'auto', alignSelf: 'center', cursor: 'pointer'}}
                                />
                            </ListItemIcon>
                            : null
                        }
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
                        
                        <ListItemText style={{marginLeft: 0}}>{sport.eventType.name}</ListItemText>
                        </ListItem>
                        <tr style={{display: 'flex', flexDirection: 'row', height: "3em", paddingBottom: "2px", marginTop: '0.5em', marginLeft: '2rem'}}>
                            {currentSportId !== undefined &&
                                sport.eventType.id === currentSportId ? (
                                    <SportsFilterList
                                        list={countries.sort((a, b) => a.countryCode.localeCompare(b.countryCode))}
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
                    <Divider style = {{marginTop: '0.5em'}}/>
                </React.Fragment>
            );
        })
    );
};