import crypto from "crypto";
import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { cancelOrder, placeOrder } from "../../actions/order";
import { getLTP } from "../../selectors/marketSelector";
import { getMatchedBets, getSelectionMatchedBets, getUnmatchedBets } from "../../selectors/orderSelector";
import { getStakeVal } from "../../selectors/settingsSelector";
import { ALL_PRICES, formatPrice } from "../../utils/ladder/CreateFullLadder";
import LadderContainer from "./LadderContainer";
import LadderHeader from "./LadderHeader";
import LadderRow from "./LadderRow";
import OrderRow from "./Orders/OrderRow";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import { findTickOffset } from "../../utils/TradingStategy/TickOffset";
import { updateBackList } from "../../actions/back";
import { updateLayList } from "../../actions/lay";
import { updateStopLossList } from "../../actions/stopLoss";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { updateStopEntryList } from "../../actions/stopEntry";

const Ladder = ({id, ltp, marketStatus, layFirstCol, setLayFirst, onPlaceOrder, onCancelOrder, order, unmatchedBets, matchedBets, setLadderSideLeft, onChangeStopLossList, backList, onChangeBackList, layList, onChangeLayList, stopLossHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks,
				tickOffsetUnits, tickOffsetTrigger, tickOffsetHedged, fillOrKillSelected, fillOrKillSeconds, fillOrKillList, onChangeFillOrKillList, stopEntryList, onChangeStopEntryList, onChangeTickOffsetList, onUpdateFillOrKillList, stopLossOffset, stopLossTrailing, stopLossList}) => {
	
	const containerRef = useRef(null);
	const listRef = useRef();
	const [listRefSet, setlistRefSet] = useState(false);
	const [isReferenceSet, setIsReferenceSet] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [isLadderDown, setLadderDown] = useState(false);
	const [ltpIsScrolling, setLTPIsScrolling] = useState(true);

	const setReferenceSent = useCallback(() => {
		setIsReferenceSet(true);
	}, []);

	const scrollToLTP = () => {
		const ltpIndex = ALL_PRICES.findIndex(item => parseFloat(item) === parseFloat(ltp[0]));
		if (listRef.current !== null && listRef.current !== undefined && ltpIndex !== -1) {
			// we do the calculation because we start in reverse
			listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, "center");
			setlistRefSet(true);
		}
	};

	const resumeLTPScrolling = useCallback(() => {
		setLTPIsScrolling(true);
	}, [ltpIsScrolling]);

	const pauseLTPScrolling = useCallback(() => {
		setLTPIsScrolling(false);
	}, [ltpIsScrolling]);

	// Scroll to the LTP when the ladder first loads
	useEffect(() => {
		setTimeout(() => {
			scrollToLTP();
		}, 1000);
	}, []);

	useEffect(() => {
		scrollToLTP();
	}, [isLadderDown]);

	// Scroll to LTP when the LTP or order changes
	useEffect(() => {
		if (ltpIsScrolling) scrollToLTP();
	}, [ltp, order]);

	const placeOrder = useCallback(data => {
		onPlaceOrder({
			marketId: data.marketId,
			side: data.side,
			size: data.size,
			price: data.price,
			selectionId: data.selectionId,
			customerStrategyRef: data.customerStrategyRef,
			orderCompleteCallBack: data.orderCompleteCallBack,
			unmatchedBets: unmatchedBets,
			matchedBets: matchedBets,
			minFillSize: data.minFillSize
		});
	}, [matchedBets, onPlaceOrder, unmatchedBets]);

	const placeStopLossOrder = useCallback(async data => {
		const newStopLoss = {
			marketId: data.marketId,
			selectionId: parseInt(id),
			side: data.side,
			size: data.size,
			price: data.price,
			units: data.units,
			rfs: data.rfs,
			assignedIsOrderMatched: data.assignedIsOrderMatched,
			betId: data.betId,
			hedged: data.hedged,
			strategy: "Stop Loss",
			tickOffset: data.custom ? 0 : stopLossOffset,
			trailing: data.custom ? false : stopLossTrailing
		};

		const newStopLossList = Object.assign({}, stopLossList);
		newStopLossList[newStopLoss.selectionId] = newStopLoss;

		await fetch("/api/save-order", {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			method: "POST",
			body: JSON.stringify(newStopLoss)
		});

		onChangeStopLossList(newStopLossList);
	}, [id, onChangeStopLossList, stopLossList, stopLossOffset, stopLossTrailing]);

	const handleHedgeCellClick = useCallback((marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber) => {
		// if (!PLHedgeNumber) return;

		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);

		console.log('hedge cell should cancel bet depends on this ', unmatchedBetsOnRow);

		// // CANCEL ORDER IF CLICK UNMATCHED BET
		// Map through all the unmatched bets and cancel all made at this price
		if (unmatchedBetsOnRow) {
			unmatchedBetsOnRow.forEach(unmatchedBet => {
				onCancelOrder({
					marketId: marketId,
					betId: unmatchedBet.betId,
					sizeReduction: null,
					matchedBets: matchedBets,
					unmatchedBets: unmatchedBets
				});
			});
		} else if (PLHedgeNumber && PLHedgeNumber.size > 0) {
			placeOrder({
				marketId: marketId,
				side: side,
				size: PLHedgeNumber.size,
				price: price,
				selectionId: selectionId,
				customerStrategyRef: referenceStrategyId,
				unmatchedBets: unmatchedBets,
				matchedBets: matchedBets
			});
		}
	}, [matchedBets, onCancelOrder, placeOrder, unmatchedBets]);

	const handlePlaceOrder = useCallback((side, price, marketId, selectionId, stakeVal, stopLossSelected, stopLossData,
		stopLossUnits, changeStopLossList, hedgeSize) => {
		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);

		console.log('stop loss, ', stopLossSelected, stopLossData);

		console.table({
			side: side,
			price: formatPrice(price),
			marketId: marketId,
			selectionId: selectionId,
			customerStrategyRef: referenceStrategyId,
			unmatchedBets: unmatchedBets,
			matchedBets: matchedBets,
			size: stakeVal[selectionId]
		});

		// stoploss and fill or kill can't be together, stoploss takes priority
		placeOrder({
			side: side,
			price: formatPrice(price),
			marketId: marketId,
			selectionId: selectionId,
			customerStrategyRef: referenceStrategyId,
			unmatchedBets: unmatchedBets,
			matchedBets: matchedBets,
			size: stakeVal[selectionId],
			orderCompleteCallBack: async betId => {
				if (stopLossSelected && !stopLossData) {
					console.log('placing stop loss');
					console.log({
						side: side === "BACK" ? "LAY" : "BACK",
						price: formatPrice(price),
						custom: false,
						units: stopLossUnits,
						rfs: referenceStrategyId,
						assignedIsOrderMatched: false,
						size: stakeVal[selectionId],
						betId: betId,
						hedged: stopLossHedged,
						marketId: marketId
					});

					
					placeStopLossOrder({
						side: side === "BACK" ? "LAY" : "BACK",
						price: formatPrice(price),
						custom: false,
						units: stopLossUnits,
						rfs: referenceStrategyId,
						assignedIsOrderMatched: false,
						size: stakeVal[selectionId],
						betId: betId,
						hedged: stopLossHedged,
						marketId: marketId
					});
				} else if (tickOffsetSelected) {
					const newTickOffset = Object.assign({}, tickOffsetList);
					const addedOrder = {
						strategy: "Tick Offset",
						marketId: marketId,
						selectionId: selectionId,
						price: findTickOffset(
							formatPrice(price),
							side.toLowerCase() === "lay" ? "back" : "lay",
							tickOffsetTicks,
							tickOffsetUnits === "Percent"
						).priceReached,
						size: tickOffsetHedged ? hedgeSize : stakeVal[selectionId],
						side: side === "BACK" ? "LAY" : "BACK",
						percentageTrigger: tickOffsetTrigger,
						rfs: referenceStrategyId,
						betId: betId,
						hedged: tickOffsetHedged,
						minFillSize: fillOrKillSelected ? (tickOffsetHedged ? hedgeSize : stakeVal[selectionId]) : 1
					};

					newTickOffset[referenceStrategyId] = addedOrder;

					await fetch("/api/save-order", {
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json"
						},
						method: "POST",
						body: JSON.stringify(addedOrder)
					});
					onChangeTickOffsetList(newTickOffset);
				}

				if (!stopLossSelected && fillOrKillSelected) {
					const addedFillOrKillOrder = {
						strategy: "Fill Or Kill",
						marketId: marketId,
						selectionId: selectionId,
						seconds: fillOrKillSeconds,
						startTime: Date.now(),
						betId: betId,
						rfs: referenceStrategyId
					};
					const newFillOrKillList = Object.assign({}, fillOrKillList);
					newFillOrKillList[betId] = addedFillOrKillOrder;

					await fetch("/api/save-order", {
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json"
						},
						method: "POST",
						body: JSON.stringify(addedFillOrKillOrder)
					});
					onUpdateFillOrKillList(newFillOrKillList);
				}
			}
		});
	}, [fillOrKillList, fillOrKillSeconds, fillOrKillSelected, matchedBets, onChangeTickOffsetList, onUpdateFillOrKillList, placeOrder, placeStopLossOrder, stopLossHedged, tickOffsetHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks, tickOffsetTrigger, tickOffsetUnits, unmatchedBets]);

	const cancelSpecialOrders = useCallback(orders => {
		if (!orders) return;

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

				console.table(ordersToRemove);

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
	}, [backList, fillOrKillList, layList, onChangeBackList, onChangeFillOrKillList, onChangeLayList, onChangeStopEntryList, onChangeStopLossList, onChangeTickOffsetList, stopEntryList, stopLossList, tickOffsetList]);

	return (
		<LadderContainer
			isReferenceSet={isReferenceSet}
			order={order}
			containerRef={containerRef}
			isMoving={isMoving}
			isLadderDown={isLadderDown}
			setIsReferenceSet={setReferenceSent}
			setIsMoving={setIsMoving}
			setLadderDown={setLadderDown}
			marketStatus={marketStatus}
			scrollToLTP={scrollToLTP}>
			<LadderHeader selectionId={id} setLadderDown={setLadderDown} />

			<div className={"ladder"} onContextMenu={() => false}>
				<PercentageRow
					setLadderSideLeft={setLadderSideLeft}
					selectionId={id}
					layFirstCol={layFirstCol}
					setLayFirst={setLayFirst}
					cancelSpecialOrders={cancelSpecialOrders}
				/>
				<AutoSizer>
					{({ height, width }) => (
						<List
							className="List"
							height={height}
							itemCount={ALL_PRICES.length}
							itemSize={20}
							width={width}
							ref={listRef}
							onScroll={pauseLTPScrolling()}
							style={{
								paddingRight: `${listRefSet ? listRef.current.offsetWidth - listRef.current.clientWidth : -17}px`
							}}
							itemData={{
								selectionId: id,
								handlePlaceOrder: handlePlaceOrder,
								cancelOrder: onCancelOrder,
								cancelSpecialOrders: cancelSpecialOrders,
								changeStopLossList: placeStopLossOrder,
								layFirstCol: layFirstCol,
								handleHedgeCellClick: handleHedgeCellClick,
								isMoving: isMoving,
								resumeLTPScrolling: resumeLTPScrolling,
								pauseLTPScrolling: pauseLTPScrolling
							}}>
							{LadderRow}
						</List>
					)}
				</AutoSizer>
			</div>
			<PriceRow selectionId={id} />
			<OrderRow selectionId={id} cancelSpecialOrders={cancelSpecialOrders} />
		</LadderContainer>
	);
};

const mapStateToProps = (state, { id }) => {
	return {
		ltp: getLTP(state.market.ladder, { selectionId: id }),
		unmatchedBets: getUnmatchedBets(state.order.bets),
		matchedBets: getMatchedBets(state.order.bets),
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, {
			selectionId: id
		}),
		stopLossList: state.stopLoss.list,
		stopLossOffset: state.stopLoss.offset,
		ladderUnmatched: state.settings.ladderUnmatched,
		stakeVal: getStakeVal(state.settings.stake, { selectionId: id }),
		draggingLadder: state.market.draggingLadder,

		layList: state.lay.list,
		backList: state.back.list,
		stopLossSelected: state.stopLoss.selected,
		stopLossUnits: state.stopLoss.units,
		stopLossHedged: state.stopLoss.hedged,
		tickOffsetList: state.tickOffset.list,
		tickOffsetSelected: state.tickOffset.selected,
		tickOffsetTicks: state.tickOffset.ticks,
		tickOffsetUnits: state.tickOffset.units,
		tickOffsetTrigger: state.tickOffset.percentTrigger,
		tickOffsetHedged: state.tickOffset.hedged,
		fillOrKillSelected: state.fillOrKill.selected,
		fillOrKillSeconds: state.fillOrKill.seconds,
		fillOrKillList: state.fillOrKill.list,
		stopEntryList: state.stopEntry.list
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onPlaceOrder: order => dispatch(placeOrder(order)),
		onCancelOrder: order => dispatch(cancelOrder(order)),
		onChangeBackList: list => dispatch(updateBackList(list)),
		onChangeLayList: list => dispatch(updateLayList(list)),
		onChangeStopLossList: list => dispatch(updateStopLossList(list)),
		onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
		onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
		onChangeStopEntryList: list => dispatch(updateStopEntryList(list))
	};
};

const isMoving = (prevProps, nextProps) => {
	if (nextProps.draggingLadder === nextProps.id && prevProps.order === nextProps.order) {
		return true;
	} else {
		return false;
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(Ladder, isMoving));
