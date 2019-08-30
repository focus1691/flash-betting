import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/sport';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import useStyles from '../Styles/Styles';

const Event = ({currentEvent}) => {
	// TODO get length of horse race
	const classes = useStyles();

	const date = new Date(currentEvent.openDate);
	
	return (
		<div id="sidebar-event">
			<div id="sidebar-event-section-1">
			<div id="sidebar-event-section-2">
					<span>00:01:39</span>
				</div>
				<Typography>Price: <b>5</b></Typography>
				<Typography>API: <b>33.87</b></Typography>
			</div>
			<AppBar className={classes.AppBar} position="static">
				<Typography variant="h6" className={classes.title}>
					{
						currentEvent.openDate !== 0 ? 
						date.toLocaleTimeString() + " " + currentEvent.name
						: "No Event Selected"}
						{/* 18:30 6f Class Stks Windsor */}
				</Typography>
			</AppBar>
		</div>
	);
}

const mapStateToProps = state => {
	
	return {
		currentEvent: state.sports.currentSport.currentEvent
	}
}

Event.defaultProps = 
{
	currentEvent: {
		openDate: 0,

	}
}

export default connect(mapStateToProps, null)(Event);

