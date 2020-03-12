import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { updateLadderOrder } from "../../actions/market";
import SuspendedWarning from "../GridView/SuspendedWarning";
import Ladder from "./Ladder";

const Ladders = ({ ladderOrder, sortedLadder, onChangeLadderOrder, marketOpen, marketStatus, excludedLadders, ladderUnmatched }) => {
	const [layFirstCol, setLayFirstCol] = useState(true);

	const setLayFirst = useCallback(() => {
		setLayFirstCol(!layFirstCol);
	}, [layFirstCol]);
	
	useEffect(() => {
		// initialize the order object
		const newOrderList = {};

		for (var i = 0; i < sortedLadder.length; i++) {
			newOrderList[i] = sortedLadder[i];
		}

		onChangeLadderOrder(newOrderList);
	}, [onChangeLadderOrder, sortedLadder]);

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
		sortedLadder: state.market.sortedLadder,
		excludedLadders: state.market.excludedLadders,
		ladderOrder: state.market.ladderOrder,
		ladderUnmatched: state.settings.ladderUnmatched
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangeLadderOrder: order => dispatch(updateLadderOrder(order))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Ladders);