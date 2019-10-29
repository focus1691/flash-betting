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
import Divider from '@material-ui/core/Divider';

const MyMarkets = props => {

	const [selectedMarket, setSelectedMarket] = useState({})

	const [currentSport, setCurrentSport] = useState({});
	const {
		currentSportId,
		sportCountries,
		currentCountry,
		countryCompetitions,
		currentCompetition,
		competitionEvents,
		currentEvent,
		eventMarkets
	} = currentSport;

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
		if (marketSelection === selectedMarket.id || marketSelection.id === selectedMarket.id) {
			setSelectedMarket({});
			setCurrentSport({});
			return;
		}

		// set back to undefined if they don't want to see the menu anymore, click on the same button another time
		if (currentSport[currentMarket] === marketSelection) {
		  const newSport = Object.assign({}, currentSport);
	
		  newSport[currentMarket] = undefined;
		  newSport[marketList] = undefined;
	
		  setCurrentSport(newSport);
		  return;
		}
	
		const response = await fetch(
		  `/api/${api}?sportId=${sportId}&&country=${country}&&competitionId=${competition}&&eventId=${event}`
		);
		const data = await response.json();
		
		const newSport = Object.assign({}, currentSport);

		newSport[currentMarket] = marketSelection;
		newSport[marketList] = mapMarkets(data);
		if (newSport.currentSportId === undefined) newSport.currentSportId = sportId;
		if (newSport.currentCountry === undefined) newSport.currentCountry = country;

		setCurrentSport(newSport);
	
		return data;
	};

	const getNewName = item => {
        const marketStartTime = new Date(item.marketStartTime)

        const marketStartDate = marketStartTime.toLocaleString('en-us', { timeZone: 'UTC', hour12: false  })
        return Object.assign(item, {marketName: marketStartDate + ' ' + item.event.venue + ' ' + item.marketName})
    }

	const handleSelectMyMarket = (id, name, sportId, type, country) => {
		/*
			id - id for the selection
			name - name displayed on myMarkets
			sportId - the sport that the selection is associated with
			type - the type of the selection (sport, country, competition, event, market)
		*/
	
		setSelectedMarket({id, name, sportId, type, country})
		
		switch (type) {
			case "Sport":
				// its a today's card
				if (/TC-/gm.test(id)) {
					handleMarketClick({id, name}, 'currentEvent', 'eventMarkets', 'list-todays-card', id.replace(/TC-/, ''), '', '', '', data => data.map(item => getNewName(item)))
					break;
				}
				handleMarketClick({id}, 'currentSportId', 'sportCountries', 'list-countries', sportId)
				break;
			case "Country":
				handleMarketClick({id}, 'currentCountry', 'countryCompetitions', 'list-competitions', sportId, id, '', '', data => data.map(item => item.competition))
				break;
			case "Competition":
				handleMarketClick({id, name}, 'currentCompetition', 'competitionEvents', 'list-competition-events', sportId, country, id, '', data => data.map(item => item.event))
				break;
			case "Event":
				handleMarketClick({id, name}, 'currentEvent', 'eventMarkets', 'list-markets', '', '', '', id, data => data.result)
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
		  props.onReceiveMyMarkets(res)
		})
		.catch(res => {})
	}

	const renderMarkets = () => {
		return props.myMarkets.map((market, index) => {
			return (
				<React.Fragment>
					<tr style={{display: 'flex', flexDirection: 'row', height: "3em", paddingBottom: "2px", marginTop: '0.5em', marginLeft: '1rem'}}>
						<ListItemIcon 
							style={{minWidth: 'auto', cursor: 'pointer'}}
							onClick={() => updateMyMarkets('sub', market.id, market.name, market.sportId, market.type, market.country)}
						>
							<img
								src={window.location.origin + "/icons/rounded-remove-button.png"}
								alt={"Remove"}
								style = {{height: '16px', width: 'auto', alignSelf: 'center', 
										filter: 'invert(22%) sepia(92%) saturate(6689%) hue-rotate(358deg) brightness(91%) contrast(121%)'}}
							/>
						</ListItemIcon>
						<ListItem 
							onClick={() => market.type === "Market" ? window.open(`/dashboard?marketId=${market.id}`) : handleSelectMyMarket(market.id, market.name, market.sportId, market.type, market.country)} button>

							<ListItemText style={{minWidth: `13em`}}>{market.name}</ListItemText>
						</ListItem>
					</tr>
				{/* If last one don't make divider */}
				{index === props.myMarkets.length - 1 ? null : <Divider style={{ width: "100%" }} />}
				</React.Fragment>
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
					  currentCountry={currentCountry.id}
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
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onReceiveMyMarkets: markets => dispatch(actions.loadMyMarkets(markets)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyMarkets);