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

const AllSports = props => {

	const classes = useStyles();

	useEffect(() => {
		fetch(`/api/get-all-sports`)
		.then(res => res.json())
		.then(sports => props.onReceiveAllSports(sports));
	});

	useEffect(() => {
		console.log(props.sports.currentSport)
	}, [props.sports.currentSport]);

	const handleClick = (sport) => {
		console.log('click', sport);


		// set back to undefined if they don't want to see the menu anymore, click on same sport another time
		if (props.sports.currentSport.currentSportId === sport.eventType.id) {
			props.onUpdateCurrentSport({currentSportId: undefined, marketCountries: undefined, currentCountry: undefined});
			return;
		}
		
		fetch(`/api/list-countries?sportId=${sport.eventType.id}`)
		.then(res => res.json())
		.then(data => {
			props.onUpdateCurrentSport({currentSportId: sport.eventType.id, marketCountries: data, currentCountry: undefined});
		})
	}

	return (
		<div>
			<table id="all-sports">
				<tbody>
					<List>
						{props.sports.sports.map(sport => {
							// if we have a sport selected
							const currentSportId = props.sports.currentSport.currentSportId;
							if (props.sports.currentSport.currentSportId !== undefined && sport.eventType.id !== currentSportId) {
								return null;
							}

							return (
								<React.Fragment>
									<tr>
										<ListItem button onClick={(e) => handleClick(sport)}>
											<ListItemIcon>
												<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"} />
											</ListItemIcon>
											<ListItemText>{sport.eventType.name}</ListItemText>
										</ListItem>
										
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
		currentSport: state.currentSport
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveAllSports: sports => dispatch(actions.setAllSports(sports)),
		onUpdateCurrentSport: sport => dispatch(actions.setCurrentSport(sport))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AllSports);