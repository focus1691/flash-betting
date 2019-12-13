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
			.then(async data => {
				setEvents(await data);
			})
	}, []);

	const renderEvents = () => {
		if (events) {
			return events.map(event => {
				return (
					<ListItem
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