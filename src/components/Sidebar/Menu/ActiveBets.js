import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Divider from "@material-ui/core/Divider";

const ActiveBets = () => {

	const [events, setEvents] = useState([]);

	useEffect(() => {
		fetch('/api/get-events-with-active-bets')
			.then(res => res.json())
			.then(data => {
				setEvents(data);
			})
	}, []);

	const renderEvents = () => {
		return events.map(event => {
			return (
				<ListItem
					button
					onClick={e => window.open(`/dashboard?marketId=${event.marketId}`)}
				>
					<ListItemIcon>
						<img
							src={window.location.origin + "/icons/expand.png"}
							alt={"Expand"}
						/>
					</ListItemIcon>
					<ListItemText>{event.marketName}</ListItemText>
				</ListItem>
			);
		});
	}

	return (
		<List>
			{renderEvents()}
		</List>
	);
}

export default ActiveBets;