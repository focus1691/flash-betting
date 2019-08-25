import React, { useEffect } from "react";
import { connect } from 'react-redux';
import * as actions from '../../../actions/sport';
import useStyles from '../../Styles/Styles';
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import SportsFilterList from "./SportsFilterList";

const AllSports = props => {

	const classes = useStyles();

	useEffect(() => {
		fetch(`/api/get-all-sports`)
		.then(res => res.json())
		.then(sports => props.onReceiveAllSports(sports));
	});

	useEffect(() => {
		// console.log(props.sports.currentSport)
		// fetch(`/api/list-events?sportId=${props.sports.currentSport.currentSportId}`)
		// .then(res => res.json())
		// .then(console.log)
		console.log(props.sports.currentMarket)
	}, [props.sports.currentMarket]);

	const handleSportClick = (sport) => {
		// console.log('click', sport);


		// set back to undefined if they don't want to see the menu anymore, click on same sport another time
		if (props.sports.currentSport.currentSportId === sport.eventType.id) {
			props.onUpdateCurrentSport({currentSportId: undefined, marketCountries: undefined, currentCountry: undefined, currentEvent: undefined});
			return;
		}
		
		fetch(`/api/list-countries?sportId=${sport.eventType.id}`)
		.then(res => res.json())
		.then(data => {
			props.onUpdateCurrentSport({currentSportId: sport.eventType.id, marketCountries: data, currentCountry: undefined, currentEvent: undefined});
		})
	}

	const handleCountryClick = (country) => {
		// console.log('click', country);

		
		// set back to undefined if they don't want to see the menu anymore, click on same country another time
		if (props.sports.currentSport.currentCountry === country.countryCode) {
			props.onUpdateCurrentSport({...props.sports.currentSport, currentCountry: undefined});
			return;
		}

		fetch(`/api/list-events?sportId=${props.sports.currentSport.currentSportId}&&country=${props.sports.currentSport.currentCountry}`)
		.then(res => res.json())
		.then(data => {
			props.onUpdateCurrentSport({...props.sports.currentSport, currentCountry: country.countryCode, countryEvents: data.map(item => item.event), currentEvent: undefined});
		})
	}

	const handleEventClick = (event) => {
		// console.log('click', event);

		// set back to undefined if they don't want to see the menu anymore, click on same event another time
		if (props.sports.currentSport.currentEvent === event) {
			props.onUpdateCurrentSport({...props.sports.currentSport, currentEvent: undefined});
			return;
		}

		fetch(`/api/list-markets?eventId=${event.id}`)
		.then(res => res.json())
		.then(data => {
			props.onUpdateCurrentSport({...props.sports.currentSport, currentEvent: event, eventMarkets: data.result, });
		})
	}

	const handleMarketClick = (market) => {
		// console.log('click', market, currentEvent.id);

		fetch(`/api/get-market-info?eventId=${currentEvent.id}&&marketType=${market.marketType}`)
		.then(res => res.json())
		.then(data => {
			props.onUpdateCurrentMarket(data.result[0])
		})
	}

	const {currentSportId, marketCountries, currentCountry, countryEvents, currentEvent, eventMarkets,} = props.sports.currentSport;

	return (
		<div>
			<table id="all-sports">
				<tbody>
					<List>
						{

							currentEvent !== undefined && eventMarkets !== undefined && eventMarkets.length > 0 ? 

							<div>
								<React.Fragment>
									<ListItem button onClick={(e) => handleEventClick(currentEvent)}>
											<ListItemIcon>
												<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
											</ListItemIcon>
											<ListItemText>{currentEvent.name}</ListItemText>
										</ListItem>
								</React.Fragment>
								<tr>
									<SportsFilterList list = {eventMarkets} itemSelector = {'marketName'} clickHandler = {handleMarketClick}/>
								</tr>
							</div>

							:

							currentCountry !== undefined && countryEvents !== undefined && countryEvents.length > 0 && currentEvent === undefined ? 
							<div>
								<React.Fragment>
									<ListItem button onClick={(e) => handleCountryClick(currentCountry)}>
											<ListItemIcon>
												<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
											</ListItemIcon>
											<ListItemText>{currentCountry}</ListItemText>
										</ListItem>
								</React.Fragment>
								<tr>
									<SportsFilterList list = {countryEvents} itemSelector = {'name'} clickHandler = {handleEventClick}/>
								</tr>
							</div>
							
							:
						
							
							// Used for selecting sport and country
							props.sports.sports.map(sport => {
								// if we have a sport selected

								if (currentSportId !== undefined && sport.eventType.id !== currentSportId) {
									return null;
								} 

								return (
									<React.Fragment>
										<tr>
											<ListItem button onClick={(e) => handleSportClick(sport)}>
												<ListItemIcon>
													<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
												</ListItemIcon>
												<ListItemText>{sport.eventType.name}</ListItemText>
											</ListItem>
											<tr>
												{currentSportId !== undefined && sport.eventType.id === currentSportId ? 
													<SportsFilterList list = {marketCountries} itemSelector = {'countryCode'} clickHandler = {handleCountryClick}/>
												: null}
											</tr>
										</tr>
										<Divider />
									</React.Fragment>
								);
						})}
					</List>
				</tbody>
			</table>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		sports: state.sports,
		currentSport: state.currentSport,
		currentMarket: state.currentMarket
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveAllSports: sports => dispatch(actions.setAllSports(sports)),
		onUpdateCurrentSport: sport => dispatch(actions.setCurrentSport(sport)),
		onUpdateCurrentMarket: market => dispatch(actions.setCurrentMarket(market))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AllSports);