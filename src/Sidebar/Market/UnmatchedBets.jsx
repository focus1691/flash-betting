import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import useStyles from '../../Styles/Styles.jsx';

const UnmatchedBets = () => {
	const classes = useStyles();

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Unmatched Bets
				</Typography>
			</AppBar>
			<table id="menu-unmatched-bets">
				<tbody>
				
				</tbody>
			</table>
		</div>
	);
}

export default UnmatchedBets;