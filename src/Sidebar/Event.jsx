import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import useStyles from '../Styles/Styles.jsx';

const Event = () => {

	const classes = useStyles();

	return (
		<div id="sidebar-event">
			<div id="sidebar-event-section-1">
				<span>Price: 5</span>
				<span>API: 33.87</span>
				<div id="sidebar-event-section-2">
					<span>00:01:39</span>
				</div>
			</div>
			<AppBar className={classes.AppBar} position="static">
				<Typography variant="h6" className={classes.title}>
				18:30 6f Class Stks Windsor
				</Typography>
			</AppBar>
		</div>
	);
}

export default Event;