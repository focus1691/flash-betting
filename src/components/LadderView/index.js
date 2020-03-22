import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { updateLadderOrder, setSortedLadder, updateExcludedLadders } from "../../actions/market";
import { sortLadder } from "../../utils/ladder/SortLadder";
import SuspendedWarning from "../GridView/SuspendedWarning";
import Ladder from "./Ladder";

const Ladders = ({ eventType, ladders, ladderOrder, sortedLadder, ladderOrderList, onChangeLadderOrder, onChangeExcludedLadders, marketOpen, marketStatus, onSortLadder, excludedLadders, ladderUnmatched }) => {
	const [layFirstCol, setLayFirstCol] = useState(true);

	const setLayFirst = useCallback(() => {
		setLayFirstCol(!layFirstCol);
	}, [layFirstCol]);

	useEffect(() => {
		//! If it's not a Greyhound Race (4339), we sort by the LTP
		if (eventType !== "4339") {
		  var sortedLadderIndices = sortLadder(ladders);
		  onSortLadder(sortedLadderIndices);
		  onChangeExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));
		}
	  }, [eventType, ladders, onChangeExcludedLadders, onChangeLadderOrder, onSortLadder]);

	  //* Initialise the ladder order to the sorted positions
	  //! Used for dragging & dropping ladders
	  useEffect(() => {
		const newOrderList = {};
	
		for (var i = 0; i < sortedLadder.length; i++) {
			newOrderList[i] = sortedLadder[i];
		}
	
		onChangeLadderOrder(newOrderList);
	  }, []);

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
		ladderOrderList: state.market.ladderOrder, //! For the ladderview specifically when swapping ladders
		excludedLadders: state.market.excludedLadders,
		ladderOrder: state.market.ladderOrder,
		ladderUnmatched: state.settings.ladderUnmatched,

		eventType: state.market.eventType,
		ladders: state.market.ladder
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangeLadderOrder: order => dispatch(updateLadderOrder(order)),

		onChangeExcludedLadders: excludedLadders => dispatch(updateExcludedLadders(excludedLadders)),
		onSortLadder: sortedLadder => dispatch(setSortedLadder(sortedLadder))
		
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Ladders);