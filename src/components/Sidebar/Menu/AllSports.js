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

export default connect(mapStateToProps, mapDispatchToProps)(AllSports);