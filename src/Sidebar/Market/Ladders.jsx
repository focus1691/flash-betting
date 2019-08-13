import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: "#303030",
    color: "orange",
    fontWeight: "900",
    border: "2px solid #fff"
  },
  title: {
  	textAlign: "center",
  	fontWeight: "bold"
  },
  group: {
    margin: theme.spacing(1, 0),
  }
}));

const Ladders = () => {
	const classes = useStyles();

	return (
		<div>
			<AppBar className={classes.appBar} position="static">
				<Typography variant="h6" className={classes.title}>
				Ladders
				</Typography>
			</AppBar>
			<table id="menu-ladder">
				<tbody>
					{renderContenders()}
					{renderContenders()}
					{renderContenders()}
					{renderContenders()}
				</tbody>
			</table>
		</div>
	);
};

const renderContenders = () => {
	return (
		<tr>
			<td>Night Secret</td>
			<td>2.04</td>
			<td>8.40</td>
			<td>2.06</td>
			<td><input type="checkbox"/></td>
		</tr>
	);
};

export default Ladders;