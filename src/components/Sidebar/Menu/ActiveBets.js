import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

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