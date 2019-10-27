import React from "react";
import SportsFilterList from "./SportsFilterList";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";

export default ({ sports, currentSportId, countries, handleClick }) => {
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
                    <Divider />
                </React.Fragment>
            );
        })
    );
};