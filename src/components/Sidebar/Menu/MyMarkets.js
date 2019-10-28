import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/market";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SelectSport from "./SelectSport";
import SelectCompetition from "./SelectCompetition";
import SelectEvent from "./SelectEvent";
import SelectMarket from "./SelectMarket";
import { setCurrentSport } from "../../../actions/sport";

const MyMarkets = props => {

	const [selectedMarket, setSelectedMarket] = useState({})

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

	const handleMarketClick = async (
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
	
		// if the button we pressed matches the selectedMarket, we want to go back to myMarkets
		if (marketSelection === selectedMarket.id) {
			setSelectedMarket({});
		}

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

	const handleSelectMyMarket = (id, name, sportId, type) => {
		/*
			id - id for the selection
			name - name displayed on myMarkets
			sportId - the sport that the selection is associated with
			type - the type of the selection (sport, country, competition, event, market)
		*/
		setSelectedMarket({id, name, sportId, type})
		switch (type) {
			case "Sport":
				handleMarketClick(id, 'currentSportId', 'sportCountries', 'list-countries', sportId)
				break;
			case "Country":
				handleMarketClick(id, 'currentCountry', 'countryCompetitions', 'list-competitions', sportId, id, '', '', data => data.map(item => item.competition))
				break;
			case "Competition":
				break;
			case "Event":
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		fetch('/api/get-my-markets')
			.then(res => res.json())
			.then(markets => props.onReceiveMyMarkets(markets));
	}, []);

	const updateMyMarkets = (action, id, name, sportId, type) => {
		/*
			myMarkets - myMarkets that will be edited
			action - add to my markets, or remove
			id - id for the selection
			name - name displayed on myMarkets
			sportId - the sport that the selection is associated with
			type - the type of the selection (sport, country, competition, event, market)
		*/
		const marketSelection = {id, name, sportId, type};
		
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
		  props.onReceiveMyMarkets(res)
		})
		.catch(res => {})
	}

	const renderMarkets = () => {
		return props.myMarkets.map(market => {
			return (
				<ListItem onClick={() => handleSelectMyMarket(market.id, market.name, market.sportId, market.type)} button>
					<ListItemIcon>
						<img
							src={window.location.origin + "/icons/rounded-remove-button.png"}
							alt={"Remove"}
							style = {{filter: 'invert(22%) sepia(92%) saturate(6689%) hue-rotate(358deg) brightness(91%) contrast(121%)'}}
						/>
					</ListItemIcon>
					<ListItemText>{market.name}</ListItemText>
				</ListItem>
			)
		});
	}

	return (
		<List>
			{!selectedMarket.type ? 
				// Selecting myMarkets
				renderMarkets()
				:
				// Selecting Market
				currentEvent !== undefined &&
					eventMarkets !== undefined &&
					eventMarkets.length > 0 ?
					<SelectMarket
					currentSportId={currentSportId}
					name={currentEvent.name}
					markets={eventMarkets.sort((a, b) => a.marketName.localeCompare(b.marketName))}
					handleClick={handleMarketClick}
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
						handleClick={handleMarketClick}
						myMarkets = {props.myMarkets}
						updateMyMarkets = {updateMyMarkets}
					/>
					: // Selecting Competition
					currentCountry !== undefined &&
                    countryCompetitions !== undefined &&
                    countryCompetitions.length > 0 &&
                    currentEvent === undefined ?
					<SelectCompetition
                      country={currentCountry}
                      competitions={countryCompetitions === undefined ? [] : countryCompetitions}
                      handleClick={handleMarketClick}
                      currentSportId={currentSportId}
                      myMarkets = {props.myMarkets}
                      updateMyMarkets = {updateMyMarkets}
                    />
                    : // Selecting Sport
					<SelectSport
						sports={props.sports}
						currentSportId={selectedMarket.id}
						countries={sportCountries === undefined ? [] : sportCountries}
						handleClick={handleMarketClick}
						myMarkets = {props.myMarkets}
						updateMyMarkets = {updateMyMarkets}
					/>
            }
		</List>
	);
}

const mapStateToProps = state => {
	return {
		myMarkets: state.market.myMarkets,
		sports: state.sports,
		currentSport: state.currentSport
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onReceiveMyMarkets: markets => dispatch(actions.loadMyMarkets(markets)),
		onUpdateCurrentSport: sport => dispatch(setCurrentSport(sport)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyMarkets);