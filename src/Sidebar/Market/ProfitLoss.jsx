import React, {Component} from 'react';
import useStyles from '../../Styles/Styles.jsx';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

const ProfitLoss = () => {
	const classes = useStyles();

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Profit & Loss
				</Typography>
			</AppBar>
			<table id="menu-profit-loss">
				<tbody>
					{renderProfitAndLoss()}
				</tbody>
			</table>
		</div>
	);
};

const renderProfitAndLoss = () => {
	return (
		<React.Fragment>
			<tr>
				<td>Selection</td>
				<td>Win</td>
				<td>Lose</td>
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
			<tr>
				<td>Night Secret</td>
				<td>0.80</td>
				<td>0.80</td>			
			</tr>
		</React.Fragment>
	);
};

export default ProfitLoss;