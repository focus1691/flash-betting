import React, { useEffect } from "react";
import { connect } from 'react-redux';
import SocketContext from '../../../SocketContext';
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

const AllSport = props => {

	const classes = useStyles();

	useEffect(() => {
		if (props.sports.length === 0 && props.socket.emit('get_all_sports', {sessionKey: localStorage.getItem("sessionKey")}));

		props.socket.on('all_sports', data => {
			props.onReceiveAllSports(data.sports)
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
						{props.sports.map(sport => {
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

const AllSportsWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <AllSport {...props} socket={socket} />}
	</SocketContext.Consumer>
);

const mapStateToProps = state => {
	return {
		sports: state.sports
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onReceiveAllSports: sports => dispatch(actions.setAllSports(sports))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AllSportsWithSocket);