import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import useStyles from '../../Styles/Styles.jsx';

const MatchedBets = () => {
	const classes = useStyles();
	console.log(classes);

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Matched Bets
				</Typography>
			</AppBar>
			<table id="menu-matched-bets">
				<tbody>
					{}
				</tbody>
			</table>
		</div>
	);
}

export default MatchedBets;