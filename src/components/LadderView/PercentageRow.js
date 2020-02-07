import React, { memo, useMemo } from "react";
import { connect } from "react-redux";
import { updateBackList } from "../../actions/back";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { updateLayList } from "../../actions/lay";
import { cancelOrderAction, updateOrders } from "../../actions/order";
import { updateStopEntryList } from "../../actions/stopEntry";
import { updateStopLossList } from "../../actions/stopLoss";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { getLTP, getLTPDelta, getPercent, getTV } from "../../selectors/marketSelector";
import { combineUnmatchedOrders } from "../../utils/Bets/CombineUnmatchedOrders";
import { getLTPstyle } from "../../utils/ladder/DeconstructLadder";
import Tooltip from "@material-ui/core/Tooltip";

const PercentageRow = memo(({ltp, tv, percent, market, ltpDelta, layFirstCol, setLayFirst, onUpdateBets, selectionId, bets, stopLossList,
						tickOffsetList, stopEntryList, layList, backList, fillOrKillList, onChangeBackList, onChangeLayList, onChangeStopEntryList,
						onChangeTickOffsetList, onChangeStopLossList, onChangeFillOrKillList }) => {
	
	const ltpStyle = useMemo(() => getLTPstyle(ltp, ltpDelta), [ltp, ltpDelta]);
	const marketId = useMemo(() => market.marketId, [market.marketId]);
	const allUnmatchedBets = useMemo(() => combineUnmatchedOrders(
		backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched)[selectionId],
		[backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched, selectionId]);

	const cancelSpecialOrders = orders => {
		let ordersToRemove = [];
		const newBackList = Object.assign({}, backList);
		const newLayList = Object.assign({}, layList);
		const newStopEntryList = Object.assign({}, stopEntryList);
		const newTickOffsetList = Object.assign({}, tickOffsetList);
		const newStopLossList = Object.assign({}, stopLossList);
		const newFillOrKill = Object.assign({}, fillOrKillList);
		Object.values(orders).forEach(rfs => {
			rfs.forEach(order => {
				// figure out which strategy it's using and make a new array without it
				switch (order.strategy) {
					case "Back":
						newBackList[order.selectionId] = newBackList[order.selectionId].filter(item => item.rfs !== order.rfs);
						break;
					case "Lay":
						newLayList[order.selectionId] = newLayList[order.selectionId].filter(item => item.rfs !== order.rfs);
						break;
					case "Stop Entry":
						newStopEntryList[order.selectionId] = newStopEntryList[order.selectionId].filter(
							item => item.rfs !== order.rfs
						);
						break;
					case "Tick Offset":
						delete newTickOffsetList[order.rfs];
						break;
					case "Stop Loss":
						delete newStopLossList[order.selectionId];
						break;
					case "None":
						// if we can find something that fits with the fill or kill, we can remove that (this is because we don't make another row for fill or kill)
						if (fillOrKillList[order.betId] !== undefined) {
							ordersToRemove = ordersToRemove.concat(newFillOrKill[order.betId]);
							delete newFillOrKill[order.betId];
						}
						break;
					default:
						break;
				}

				ordersToRemove = ordersToRemove.concat(order);

				// delete from database
				try {
					fetch("/api/remove-orders", {
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json"
						},
						method: "POST",
						body: JSON.stringify(ordersToRemove)
					});
				} catch (e) {}
			});
		});

		onChangeBackList(newBackList);
		onChangeLayList(newLayList);
		onChangeStopEntryList(newStopEntryList);
		onChangeTickOffsetList(newTickOffsetList);
		onChangeStopLossList(newStopLossList);
		onChangeFillOrKillList(newFillOrKill);
	};

	const cancelAllOrdersOnSide = (
		marketId,
		selectionId,
		side,
		unmatchedBets,
		matchedBets,
		specialBets,
		betCanceler
	) => async e => {
		betCanceler(specialBets);

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
						allUnmatchedBets,
						cancelSpecialOrders
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
						allUnmatchedBets,
						cancelSpecialOrders
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
		fillOrKillList: state.fillOrKill.list,
		ltp: getLTP(state.market.ladder, { selectionId }),
		tv: getTV(state.market.ladder, { selectionId }),
		percent: getPercent(state.market.ladder, { selectionId }),
		ltpDelta: getLTPDelta(state.market.ladder, { selectionId })
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangeStopLossList: list => dispatch(updateStopLossList(list)),
		onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
		onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
		onChangeLayList: list => dispatch(updateLayList(list)),
		onChangeBackList: list => dispatch(updateBackList(list)),
		onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
		onUpdateBets: bets => dispatch(updateOrders(bets))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PercentageRow);
