import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { updateLadderOrder, setSortedLadder, updateExcludedLadders } from "../../actions/market";
import { sortLadder } from "../../utils/ladder/SortLadder";
import SuspendedWarning from "../GridView/SuspendedWarning";
import Ladder from "./Ladder";

const Ladders = ({ eventType, ladders, ladderOrder, sortedLadder, updateLadderOrder, updateExcludedLadders, marketOpen, marketStatus, setSortedLadder, excludedLadders, ladderUnmatched }) => {
	const [layFirstCol, setLayFirstCol] = useState(true);
	const setLayFirst = useCallback(() => {
		setLayFirstCol(!layFirstCol);
	}, [layFirstCol]);

	useEffect(() => {
		//! If it's not a Greyhound Race (4339), we sort by the LTP
		if (eventType !== "4339") {
		  var sortedLadderIndices = sortLadder(ladders);
		  setSortedLadder(sortedLadderIndices);
		  updateExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));
		}
		const newOrderList = {};
	
		for (var i = 0; i < sortedLadder.length; i++) {
			newOrderList[i] = sortedLadder[i];
		}
		updateLadderOrder(newOrderList);
	  }, [eventType, ladders]);

	return marketOpen && (marketStatus === "SUSPENDED" || marketStatus === "OPEN" || marketStatus === "RUNNING") ? (
		<div
			className={"ladder-container"}
			onContextMenu={e => {
				e.preventDefault();
				return false;
			}}>
			{marketOpen && sortedLadder
				? Object.values(ladderOrder)
						.filter(value => excludedLadders.indexOf(value) === -1)
						.map((value, index) => (
							<Ladder
								id={value}
								key={value}
								order={index}
								ladderUnmatched={ladderUnmatched}
								marketStatus={marketStatus}
								layFirstCol={layFirstCol}
								setLayFirst={setLayFirst}
							/>
						))
				: null}
			<SuspendedWarning marketStatus={marketStatus} />
		</div>
	) : null;
};

const mapStateToProps = state => {
	return {
		marketOpen: state.market.marketOpen,
		marketStatus: state.market.status,
		sortedLadder: state.market.sortedLadder, //! Sorted by LTP
		ladderOrder: state.market.ladderOrder, //! For the ladderview specifically when swapping ladders
		excludedLadders: state.market.excludedLadders,
		ladderUnmatched: state.settings.ladderUnmatched,
		eventType: state.market.eventType,
		ladders: state.market.ladder
	};
};

const mapDispatchToProps = { updateLadderOrder, updateExcludedLadders, setSortedLadder };

export default connect(mapStateToProps, mapDispatchToProps)(Ladders);