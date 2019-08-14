import React from "react";
import useStyles from '../../Styles/Styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';


const UserMarkets = () => {
	const classes = useStyles();

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				My Markets
				</Typography>
			</AppBar>
			<table>
				<tbody>
				
				</tbody>
			</table>
		</div>
	);
}

export default UserMarkets;