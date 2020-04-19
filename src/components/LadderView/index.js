import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { updateLadderOrder, setSortedLadder, updateExcludedLadders } from "../../actions/market";
import { sortLadder } from "../../utils/ladder/SortLadder";
import SuspendedWarning from "../GridView/SuspendedWarning";
import Ladder from "./Ladder";

const Ladders = ({ eventType, ladders, ladderOrder, sortedLadder, updateLadderOrder, updateExcludedLadders, marketOpen, marketStatus, setSortedLadder, excludedLadders }) => {
	const [layFirstCol, setLayFirstCol] = useState(true);
	const setLayFirst = useCallback(() => {
		setLayFirstCol(!layFirstCol);
	}, [layFirstCol]);

	//* Sort ladder on market open, excluding ladders are first 6
	useEffect(() => {
		var i;
		if (eventType === "4339") {
			//! Used to track ladder order when dragging & dropping ladders
			const newOrderList = {};
			for (i = 0; i < sortedLadder.length; i++) {
				newOrderList[i] = sortedLadder[i];
			}
			updateLadderOrder(newOrderList);

		} else {
			console.log('sorting ladders');
			var sortedLadderIndices = sortLadder(ladders);
			setSortedLadder(sortedLadderIndices);
			updateExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));

			//! Used to track ladder order when dragging & dropping ladders
			const newOrderList = {};
			for (i = 0; i < sortedLadderIndices.length; i++) {
				newOrderList[i] = sortedLadderIndices[i];
			}
			updateLadderOrder(newOrderList);
		}
	}, [Object.keys(ladders).length > 0]);

	//* Sort ladders each time the ladder changes
	useEffect(() => {
		if (eventType !== "4339") {
			var sortedLadderIndices = sortLadder(ladders);
			setSortedLadder(sortedLadderIndices);
		}
	}, [ladders]);

	return marketOpen && (marketStatus === "SUSPENDED" || marketStatus === "OPEN" || marketStatus === "RUNNING") ? (
		<div className={"ladder-container"} onContextMenu={(e) => e.preventDefault()}>
			{Object.values(ladderOrder)
				.filter((value) => excludedLadders.indexOf(value) === -1)
				.map((value, index) => (
					<Ladder id={value} key={value} order={index} layFirstCol={layFirstCol} setLayFirst={setLayFirst} />
				))}
			<SuspendedWarning marketStatus={marketStatus} />
		</div>
	) : null;
};

const mapStateToProps = (state) => {
	return {
		marketOpen: state.market.marketOpen,
		marketStatus: state.market.status,
		sortedLadder: state.market.sortedLadder, //! Sorted by LTP
		ladderOrder: state.market.ladderOrder, //! For the ladderview specifically when swapping ladders
		excludedLadders: state.market.excludedLadders,
		eventType: state.market.eventType,
		ladders: state.market.ladder,
	};
};

const mapDispatchToProps = { updateLadderOrder, updateExcludedLadders, setSortedLadder };

export default connect(mapStateToProps, mapDispatchToProps)(Ladders);