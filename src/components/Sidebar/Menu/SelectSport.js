import React from "react";
import SportsFilterList from "./SportsFilterList";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";

export default ({ sports, currentSportId, countries, handleClick, myMarkets, updateMyMarkets }) => {

    const getNewName = item => {
        const marketStartTime = new Date(item.marketStartTime)

        const marketStartDate = marketStartTime.toLocaleString('en-us', { timeZone: 'UTC', hour12: false  })
        return Object.assign(item, {marketName: marketStartDate + ' ' + item.event.venue + ' ' + item.marketName})
    }

    const selectSportClick = (sport) =>{

        // check if its a todays card
        if (/TC-/gm.test(sport.eventType.id)) {
            handleClick(
                sport.eventType,
                "currentEvent",
                "eventMarkets",
                "list-todays-card",
                sport.eventType.id.replace(/TC-/, ''),
                '',
                '',
                '',
                data => data.map(item => getNewName(item))
            )
        }  
        else {
            handleClick(
                sport.eventType.id,
                "currentSportId",
                "sportCountries",
                "list-countries",
                sport.eventType.id
            )
        }
        
    }

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
            const marketItemSaved = myMarkets.find(item => item.type === "Sport" && item.id == sport.eventType.id) !== undefined
            const updateMyMarketSports = () => updateMyMarkets(marketItemSaved ? 'sub' : 'add', sport.eventType.id, sport.eventType.name, sport.eventType.id, "Sport")
            const updateMyMarketCountry = (marketItemSaved, id, name, sportId) => updateMyMarkets(marketItemSaved ? 'sub' : 'add', id, name, sportId, "Country")
            return (
                <React.Fragment>
                    <tr style={Object.assign({ paddingBottom: "2px", marginTop: '0.5em'}, 
                                 currentSportId === undefined ? {display: 'flex', flexDirection: 'row', height: "3em", marginLeft: '1rem', width: '100%'} : 
                                                                { display: 'flex', flexDirection: 'column'})}>
                        {currentSportId === undefined ?
                            <ListItemIcon style={{minWidth: '0px'}} onClick={updateMyMarketSports}>
                                <img
                                    src={window.location.origin + (marketItemSaved ? "/icons/rounded-remove-button.png" : "/icons/add-button-inside-black-circle.png") }
                                    alt={"Add"}
                                    style = {{height: '16px', width: 'auto', alignSelf: 'center', cursor: 'pointer',
                                              filter: marketItemSaved ? 'invert(22%) sepia(92%) saturate(6689%) hue-rotate(358deg) brightness(91%) contrast(121%)' : 'none'}}
                                />
                            </ListItemIcon>
                            : null
                        }
                        <ListItem
                            button
                            onClick={e => selectSportClick(sport)}
                        >
                        
                        <ListItemText style={{marginLeft: 0}}>{sport.eventType.name}</ListItemText>
                        </ListItem>
                        
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
                                            currentSportId={currentSportId}
                                            myMarkets={myMarkets}
                                            idSelector={'countryCode'}
                                            updateMyMarkets={updateMyMarketCountry}
                                        />
                                    
                                ) : null}
                        </tr>
                    
                    <Divider style = {{marginTop: '0.5em'}}/>
                </React.Fragment>
            );
        })
    );
};