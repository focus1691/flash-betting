import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../actions/market";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

const MyMarkets = props => {

	const handleClick = () => {
		
	};

	useEffect(() => {
		fetch('/api/get-my-markets')
			.then(res => res.json())
			.then(markets => props.onReceiveMyMarkets(markets));
	}, []);

	const renderMarkets = () => {
		return props.myMarkets.map(market => {
			return (
				<ListItem onClick={handleClick}>
					<ListItemIcon>
						<img
							src={window.location.origin + "/icons/rounded-remove-button.png"}
							alt={"Expand"}
						/>
					</ListItemIcon>
					<ListItemText>{market.sport.name}</ListItemText>
				</ListItem>
			)
		});
	}

	return (
		<List>
			{renderMarkets()}
		</List>
	);
}

const mapStateToProps = state => {
	return {
		myMarkets: state.market.myMarkets,
		sports: state.sports,
		currentSport: state.currentSport
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onReceiveMyMarkets: markets => dispatch(actions.loadMyMarkets(markets))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MyMarkets);