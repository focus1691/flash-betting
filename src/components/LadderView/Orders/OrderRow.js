import React, { memo, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { changePriceType, updateOrder } from "../../../actions/market";
import { cancelOrder, cancelOrderAction, updateOrders } from "../../../actions/order";
import { combineUnmatchedOrders } from "../../../utils/Bets/CombineUnmatchedOrders";
import { updateStopLossList } from "../../../actions/stopLoss";
import { updateTickOffsetList } from "../../../actions/tickOffset";
import { updateStopEntryList } from "../../../actions/stopEntry";
import { updateLayList } from "../../../actions/lay";
import { updateBackList } from "../../../actions/back";
import { updateFillOrKillList } from "../../../actions/fillOrKill";
import { MatchedBet } from "./MatchedBet";
import { UnmatchedBet } from "./UnmatchedBet";

const OrderRow = memo(({selectionId, market, bets, backList, layList, stopEntryList, tickOffsetList, stopLossList,
	fillOrKillList, onChangeBackList, onChangeLayList, onChangeStopEntryList, onChangeTickOffsetList,
	onChangeStopLossList, onChangeFillOrKillList, onCancelOrder, cancelSpecialOrders, onUpdateBets, priceType, onChangePriceType}) => {

	const matchedBets = useMemo(() => {
		return Object.values(bets.matched).filter(order => parseFloat(order.selectionId) === parseFloat(selectionId));
	}, [bets.matched, selectionId]);
		
	const allUnmatchedBets = useMemo(() => combineUnmatchedOrders(
		backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched)[selectionId],
		[backList, layList, stopEntryList, tickOffsetList, stopLossList, bets.unmatched, selectionId]);

	const unmatchedBetsArr = useMemo(() => allUnmatchedBets ? Object.values(allUnmatchedBets) : [], [allUnmatchedBets]);

	const style = useMemo(() => unmatchedBetsArr.length > 0 ? "lay-body" : "", [unmatchedBetsArr.length]);

	const cancelUnmatchedOrder = useCallback(order => {
		let ordersToRemove = [];
		// figure out which strategy it's using and make a new array without it
		switch (order.strategy) {
			case "Back":
				const newBackList = Object.assign({}, backList);
				newBackList[order.selectionId] = newBackList[order.selectionId].filter(item => item.rfs !== order.rfs);
				onChangeBackList(newBackList);
				break;
			case "Lay":
				const newLayList = Object.assign({}, layList);
				newLayList[order.selectionId] = newLayList[order.selectionId].filter(item => item.rfs !== order.rfs);
				onChangeLayList(newLayList);
				break;
			case "Stop Entry":
				const newStopEntryList = Object.assign({}, stopEntryList);
				newStopEntryList[order.selectionId] = newStopEntryList[order.selectionId].filter(
					item => item.rfs !== order.rfs
				);
				onChangeStopEntryList(newStopEntryList);
				break;
			case "Tick Offset":
				const newTickOffsetList = Object.assign({}, tickOffsetList);
				delete newTickOffsetList[order.rfs];
				onChangeTickOffsetList(newTickOffsetList);
				break;
			case "Stop Loss":
				const newStopLossList = Object.assign({}, stopLossList);
				delete newStopLossList[order.selectionId];
				onChangeStopLossList(newStopLossList);
				break;
			case "None":
				// if we can find something that fits with the fill or kill, we can remove that too (this is because we don't make another row for fill or kill)
				if (fillOrKillList[order.betId]) {
					const newFillOrKill = Object.assign({}, fillOrKillList);
					ordersToRemove = ordersToRemove.concat(newFillOrKill[order.betId]);
					delete newFillOrKill[order.betId];
					onChangeFillOrKillList(newFillOrKill);
				}

				// cancel order
				onCancelOrder({
					marketId: order.marketId,
					betId: order.betId,
					sizeReduction: null,
					matchedBets: bets.matched,
					unmatchedBets: bets.unmatched
				});

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
	}, [backList, onChangeBackList, layList, onChangeLayList, stopEntryList, onChangeStopEntryList, tickOffsetList, onChangeTickOffsetList, stopLossList, onChangeStopLossList, fillOrKillList, onCancelOrder, bets.matched, bets.unmatched, onChangeFillOrKillList]);

	const cancelAllOrdersOnSelection = useCallback(async () => {
		cancelSpecialOrders(allUnmatchedBets);

		const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${market.marketId}`)
			.then(res => res.json())
			.then(res => res.currentOrders);

		if (currentOrders) {
			// filter all the ones out that arent in the same selection or arent unmatched
			const openSelectedRunnerOrders = currentOrders.filter(
				order =>
					order.selectionId === parseInt(selectionId) && (order.status === "EXECUTABLE" || order.status === "PENDING")
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
							: bets.unmatched
				});
			}, Promise.resolve());

			console.table(cancelBets);;

			if (cancelBets === undefined) return;

			onUpdateBets({
				unmatched: cancelBets.unmatched,
				matched: cancelBets.matched
			});
		}
	}, [allUnmatchedBets, bets.unmatched, cancelSpecialOrders, market.marketId, matchedBets, onUpdateBets, selectionId]);

	return (
		<div className={"order-row"}>
			<table>
				<tbody>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className={style}>
								{unmatchedBetsArr.map(rfs => rfs.map(bet => {
									return <UnmatchedBet bet={bet} cancelBet={cancelUnmatchedOrder} />
								}))}
							</tbody>
						</table>
					</td>
					<td colSpan={1} rowSpan={4} style={{ verticalAlign: "top", minHeight: "1.675em" }}>
						<button>0</button>
						<button onClick={onChangePriceType(priceType === "STAKE" ? "LIABILITY" : "STAKE")}>
							{priceType === "STAKE" ? "S" : "L"}
						</button>
						<button
							onClick={cancelAllOrdersOnSelection}>
							K
						</button>
					</td>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className={matchedBets.length > 0 ? "lay-body" : ""}>
								{matchedBets.map((bet, idx) => {
									return <MatchedBet bet={bet} index={idx} />
								})}
							</tbody>
						</table>
					</td>
				</tbody>
			</table>
		</div>
	);
});

const mapStateToProps = state => {
	return {
		priceType: state.market.priceType,
		market: state.market.currentMarket,
		bets: state.order.bets,
		stopLossList: state.stopLoss.list,
		tickOffsetList: state.tickOffset.list,
		stopEntryList: state.stopEntry.list,
		layList: state.lay.list,
		backList: state.back.list,
		fillOrKillList: state.fillOrKill.list
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangePriceType: priceType => e => dispatch(changePriceType(priceType)),
		onCancelOrder: order => dispatch(cancelOrder(order)),
		onChangeOrders: orders => dispatch(updateOrder(orders)),
		onChangeStopLossList: list => dispatch(updateStopLossList(list)),
		onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
		onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
		onChangeLayList: list => dispatch(updateLayList(list)),
		onChangeBackList: list => dispatch(updateBackList(list)),
		onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
		onUpdateBets: bets => dispatch(updateOrders(bets)) // this is for the bets
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);
