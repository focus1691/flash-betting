import React, { memo, useMemo } from "react";
import { connect } from "react-redux";
import { cancelOrderAction, updateOrders } from "../../actions/order";
import { getLTP, getLTPDelta, getPercent, getTV } from "../../selectors/marketSelector";
import { combineUnmatchedOrders } from "../../utils/Bets/CombineUnmatchedOrders";
import { getLTPstyle } from "../../utils/ladder/DeconstructLadder";
import Tooltip from "@material-ui/core/Tooltip";

const PercentageRow = memo(({ltp, tv, percent, market, ltpDelta, layFirstCol, setLayFirst, onUpdateBets, selectionId, bets, stopLossList,
						tickOffsetList, stopEntryList, layList, backList, cancelSpecialOrders }) => {
	
	const ltpStyle = useMemo(() => getLTPstyle(ltp, ltpDelta), [ltp, ltpDelta]);
	const marketId = useMemo(() => market.marketId, [market.marketId]);
	const allUnmatchedBets = useMemo(() => combineUnmatchedOrders(
		backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched)[selectionId],
		[backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched, selectionId]);

	const cancelAllOrdersOnSide = (marketId, selectionId, side, unmatchedBets, matchedBets, specialBets) => async e => {
		cancelSpecialOrders(specialBets);

		const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`)
			.then(res => res.json())
			.then(res => res.currentOrders);

		if (currentOrders) {
			// filter all the ones out that arent in the same selection or arent unmatched
			const openSelectedRunnerOrders = currentOrders.filter(
				order =>
					order.selectionId === parseInt(selectionId) &&
					(order.status === "EXECUTABLE" || order.status === "PENDING") &&
					order.side === side
			);

			// this is basically calling 1 bet after another and returning the unmatched bets it gets from it
			const cancelBets = await openSelectedRunnerOrders.reduce(async (previousPromise, nextOrder) => {
				const previousCancelOrderUnmatchedBets = await previousPromise;
				return cancelOrderAction({
					marketId: nextOrder.marketId,
					betId: nextOrder.betId,
					sizeReduction: null,
					matchedBets: matchedBets,
					unmatchedBets:
						previousCancelOrderUnmatchedBets && previousCancelOrderUnmatchedBets.unmatched
							? previousCancelOrderUnmatchedBets.unmatched
							: unmatchedBets
				});
			}, Promise.resolve());

			if (cancelBets === undefined) return;

			onUpdateBets({
				unmatched: cancelBets.unmatched,
				matched: cancelBets.matched
			});
		}
	};

	return (
		<div className={"percentage-row"}>
			{/* Total Traded */}
			<div colSpan={3} className={"th"}>
				{tv}
			</div>
			{/* Cancel Back/Lay */}
			<Tooltip title={`Cancel selection ${layFirstCol ? "lay" : "back"} bets`} aria-label="Cancel selections">
				<div
					className={"th"}
					onClick={cancelAllOrdersOnSide(
						marketId,
						selectionId,
						layFirstCol ? "LAY" : "BACK",
						bets.unmatched,
						bets.matched,
						allUnmatchedBets
					)}
				/>
			</Tooltip>
			{/* Back/Lay */}
			<div className={"th"} style={{ backgroundColor: layFirstCol ? "#FCC9D3" : "#BCE4FC" }}>
				{`${percent[layFirstCol ? "lay" : "back"]}%`}
			</div>
			{/* LTP */}
			<Tooltip title={`Swap Back/Lay Columns`} aria-label="Swap matched columns">
				<div className={"th"} style={ltpStyle} onClick={setLayFirst}>
					{ltp[0]}
				</div>
			</Tooltip>
			{/* Lay/Back */}
			<div className={"th"} style={{ backgroundColor: layFirstCol ? "#BCE4FC" : "#FCC9D3" }}>
				{`${percent[layFirstCol ? "back" : "lay"]}%`}
			</div>
			{/* Cancel Lay/Back */}
			<Tooltip title={`Cancel selection ${layFirstCol ? "back" : "lay"} bets`} aria-label={"Cancel selections"}>
				<div
					className={"th"}
					onClick={cancelAllOrdersOnSide(
						marketId,
						selectionId,
						layFirstCol ? "BACK" : "LAY",
						bets.unmatched,
						bets.matched,
						allUnmatchedBets
					)}
				/>
			</Tooltip>
		</div>
	);
});

const mapStateToProps = (state, { selectionId }) => {
	return {
		priceType: state.market.priceType,
		market: state.market.currentMarket,
		bets: state.order.bets,
		stopLossList: state.stopLoss.list,
		tickOffsetList: state.tickOffset.list,
		stopEntryList: state.stopEntry.list,
		layList: state.lay.list,
		backList: state.back.list,
		ltp: getLTP(state.market.ladder, { selectionId }),
		tv: getTV(state.market.ladder, { selectionId }),
		percent: getPercent(state.market.ladder, { selectionId }),
		ltpDelta: getLTPDelta(state.market.ladder, { selectionId })
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onUpdateBets: bets => dispatch(updateOrders(bets))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
