import React, { useEffect, useReducer } from "react";
import {Store} from "../../../Store";
import openSocket from "socket.io-client";
import useStyles from '../../Styles/Styles';
import AppBar from '@material-ui/core/AppBar';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';

export default () => {

	const { state, dispatch } = React.useContext(Store);

	const classes = useStyles();

	var socket = openSocket("http://localhost:8000");

	useEffect(() => {
		if (state.sports.length === 0 && socket.emit('get_all_sports'));

		socket.on('all_sports', data => {
			console.log(data);
			dispatch({
				type: "FETCH_SPORTS",
				payload: data.sports
			});
			// socket.off('all_sports');
		});
	});

	const handleClick = (sport) => {
		console.log('click', sport);
	}

	return (
		<div>
			<table id="all-sports">
				<tbody>
				<List>
					{state.sports.map(sport => {
						return (
							<React.Fragment>
								<tr>
									<ListItem button onClick={(e) => handleClick(sport)}>
											<ListItemIcon>
												<img src={window.location.origin + '/icons/expand.png'} alt={"Expand"}/>
											</ListItemIcon>
											<ListItemText>{sport.eventType.name}</ListItemText>
									</ListItem>
								</tr>
								<Divider/>
							</React.Fragment>
						);
					})}
				</List>
				</tbody>
			</table>
		</div>
	);
}