import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useEffect, useState } from "react";

const ActiveBets = () => {

	const [events, setEvents] = useState([]);

	const openMarket = marketId => e => {
		window.open(`/dashboard?marketId=${marketId}`);
	};

	useEffect(() => {
		fetch('/api/get-events-with-active-bets')
			.then(res => res.json())
			.then(data => {
				setEvents(data || []);
			})
	}, []);

	const renderEvents = () => {
		if (Array.isArray(events)) {
			return events.map(event => {
				return (
					<ListItem
						key={"active-bets-" + event.marketId}
						button
						onClick={openMarket(event.marketId)}
					>
						<ListItemText>{event.marketName}</ListItemText>
					</ListItem>
				);
			});
		}
		return null;
	}

	return (
		<List>
			{renderEvents()}
		</List>
	);
}

export default ActiveBets;