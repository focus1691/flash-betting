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

	 const handleClick = async (result, currentObjectSelector, currentObjectArraySelector, api, sportId = '', country = '', competition = '', event = '', dataFormatter = data => data) => {
		
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
			const newSport = Object.assign({}, props.sports.currentSport)
			
			newSport[currentObjectSelector] = undefined;
			newSport[currentObjectArraySelector] = undefined;

			props.onUpdateCurrentSport(newSport);
			return;
		}

		const request = await fetch(`/api/${api}?sportId=${sportId}&&country=${country}&&competitionId=${competition}&&eventId=${event}`);
		const data = await request.json()

		const newSport = Object.assign({}, props.sports.currentSport)

		newSport[currentObjectSelector] = result;
		newSport[currentObjectArraySelector] = dataFormatter(data);

		props.onUpdateCurrentSport(newSport);

		return data;
		
	}


	const handleMarketClick = (marketId) => {

		fetch(`/api/get-market-info?marketId=${marketId}`)
		.then(res => res.json())
		.then(data => {
			props.onUpdateCurrentMarket(data.result[0])
		})
	}

	const { currentSportId, sportCountries, currentCountry, countryCompetitions, currentCompetition, competitionEvents, currentEvent, eventMarkets } = props.sports.currentSport;

	return (
		<div>
			<table id="all-sports">
				<tbody>
					<List>
						{
							// Selecting Market
							currentEvent !== undefined && eventMarkets !== undefined && eventMarkets.length > 0 ? 

							<div>
								<React.Fragment>
									<ListItem button onClick={(e) => handleClick(currentEvent, 'currentEvent', 'eventMarkets')}>
											<ListItemIcon>
												<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
											</ListItemIcon>
											<ListItemText>{currentEvent.name}</ListItemText>
										</ListItem>
								</React.Fragment>
								<tr>
									<SportsFilterList list = {eventMarkets} itemSelector = {'marketName'} clickHandler = {data => handleMarketClick(data.id)}/>
								</tr>
							</div>

							:

							// Selecting Event
							currentCountry !== undefined && competitionEvents !== undefined && competitionEvents.length > 0 && currentEvent === undefined ? 
							<div>
								<React.Fragment>
									<ListItem 
										button 
										onClick={(e) => { currentCompetition !== undefined ? handleClick(currentCompetition, 'currentCompetition', 'competitionEvents') : handleClick(currentCountry, 'currentCountry', 'competitionEvents') }}>
												<ListItemIcon>
													<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
												</ListItemIcon>
												<ListItemText>{currentCompetition !== undefined ? currentCompetition.name : currentCountry }</ListItemText>
										</ListItem>
								</React.Fragment>
								<tr>
									<SportsFilterList 
										list = {competitionEvents} 
										itemSelector = {'name'} 
										clickHandler = {data => handleClick(data, 'currentEvent', 'eventMarkets', 'list-markets', '', '', '', data.id, data => data.result )}
									/>
								</tr>
							</div>
							
							:

							currentCountry !== undefined && countryCompetitions !== undefined && countryCompetitions.length > 0 && currentEvent === undefined ? 
							<div>
								<React.Fragment> 
									<ListItem button onClick={(e) => handleClick(currentCountry, 'currentCountry', 'countryCompetitions')}>
											<ListItemIcon>
												<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
											</ListItemIcon>
											<ListItemText>{currentCountry}</ListItemText>
										</ListItem>
								</React.Fragment>
								<tr>
									<SportsFilterList 
										list = {countryCompetitions} 
										itemSelector = {'name'} 
										clickHandler = {data => handleClick(data, 'currentCompetition', 'competitionEvents', 'list-competition-events', currentSportId, currentCountry, data.id, '', data => data.map(item => item.event))}
									/>
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
											<ListItem button onClick={(e) => handleClick(sport.eventType.id, 'currentSportId', 'sportCountries', 'list-countries', sport.eventType.id)}>
												<ListItemIcon>
													<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
												</ListItemIcon>
												<ListItemText>{sport.eventType.name}</ListItemText>
											</ListItem>
											<tr>
												{currentSportId !== undefined && sport.eventType.id === currentSportId ? 
													<SportsFilterList 
														list = {sportCountries} 
														itemSelector = {'countryCode'} 
														clickHandler = {async data => {
																const competitions = await handleClick(data.countryCode, 'currentCountry', 'countryCompetitions', 'list-competitions', currentSportId, data.countryCode, '', '', data => data.map(item => item.competition));	

																if (competitions.length === 0) {
																	await handleClick(data.countryCode, 'currentCountry', 'competitionEvents', 'list-events', currentSportId, data.countryCode, '', '', data => data.map(item => item.event));
																}
															}
														}
													/>
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