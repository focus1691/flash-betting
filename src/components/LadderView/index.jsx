import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { updateLadderOrder, setSortedLadder } from "../../actions/market";
import { sortLadder } from "../../utils/ladder/SortLadder";
import SuspendedWarning from "../GridView/SuspendedWarning";
import Ladder from "./Ladder";

const Ladders = ({ eventType, ladders, ladderOrder, sortedLadder, updateLadderOrder, marketOpen, marketStatus, setSortedLadder, excludedLadders }) => {
	const [layFirstCol, setLayFirstCol] = useState(true);
	const setLayFirst = useCallback(() => {
		setLayFirstCol(!layFirstCol);
	}, [layFirstCol]);

	//* Sort ladder on market open, excluding ladders are first 6
	useEffect(() => {
		if (eventType === "4339") {
			const newOrderList = {};
			for (let i = 0; i < sortedLadder.length; i++) {
				newOrderList[i] = sortedLadder[i];
			}
			updateLadderOrder(newOrderList);

		} else {
			var sortedLadderIndices = sortLadder(ladders);
			setSortedLadder(sortedLadderIndices);
			const newOrderList = {};
			for (let i = 0; i < sortedLadderIndices.length; i++) {
				newOrderList[i] = sortedLadderIndices[i];
			}
			updateLadderOrder(newOrderList);
		}
	}, [Object.keys(ladders).length > 0]);

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

const mapDispatchToProps = { updateLadderOrder, setSortedLadder };

export default connect(mapStateToProps, mapDispatchToProps)(Ladders);