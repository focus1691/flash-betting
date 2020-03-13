import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { ListItemText, Divider } from "@material-ui/core";
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

	return (
		<List>
			{
				Array.isArray(events) && events.map(event => {
					return (
						<>
						<ListItem
							key={"active-bets-" + event.marketId}
							button
							onClick={openMarket(event.marketId)}
						>
							<ListItemText className="active-bet-name">{event.marketName}</ListItemText>
						</ListItem>
						<Divider />
						</>
					);
				})
			}
		</List>
	);
}

export default ActiveBets;