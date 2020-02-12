import crypto from "crypto";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { removeBackOrder, updateBackList } from "../../actions/back";
import { removeLayOrder, updateLayList } from "../../actions/lay";
import { removeStopLossOrder, updateStopLossList } from "../../actions/stopLoss";
import { removeTickOffsetOrder, updateTickOffsetList } from "../../actions/tickOffset";
import { removeStopEntryOrder, updateStopEntryList } from "../../actions/stopEntry";
import { removeFillOrKillOrder, updateFillOrKillList } from "../../actions/fillOrKill";
import { cancelOrder, cancelOrderAction, placeOrder, updateOrders } from "../../actions/order";
import { getLTP } from "../../selectors/marketSelector";
import { getMatchedBets, getSelectionMatchedBets, getUnmatchedBets } from "../../selectors/orderSelector";
import { combineUnmatchedOrders } from "../../utils/Bets/CombineUnmatchedOrders";
import { getStakeVal } from "../../selectors/settingsSelector";
import { ALL_PRICES, formatPrice } from "../../utils/ladder/CreateFullLadder";
import { findTickOffset } from "../../utils/TradingStategy/TickOffset";
import LadderContainer from "./LadderContainer";
import LadderHeader from "./LadderHeader";
import LadderRow from "./Rows/LadderRow";
import OrderRow from "./Rows/OrderRow/OrderRow";
import PercentageRow from "./Rows/PercentageRow/PercentageRow";
import PriceRow from "./Rows/PriceRow";
import { getStopLoss } from "../../selectors/stopLossSelector";

const Ladder = ({id, ltp, marketStatus, layFirstCol, setLayFirst, onPlaceOrder, onCancelOrder, order, unmatchedBets, matchedBets, setLadderSideLeft, onChangeStopLossList, backList, onChangeBackList, layList, onChangeLayList, stopLossHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks,
				tickOffsetUnits, tickOffsetTrigger, tickOffsetHedged, fillOrKillSelected, fillOrKillSeconds, fillOrKillList, onChangeFillOrKillList, stopEntryList, onChangeStopEntryList, onChangeTickOffsetList, stopLossOffset, stopLossTrailing, stopLossList, stopLossUnits,
				onUpdateBets, onRemoveBackOrder, onRemoveLayOrder, onRemoveStopLossOrder, onRemoveStopEntryOrder, onRemoveTickOffsetOrder, onRemoveFillOrKillOrder, stakeVal}) => {
	
	const containerRef = useRef(null);
	const listRef = useRef();
	const [listRefSet, setlistRefSet] = useState(false);
	const [isReferenceSet, setIsReferenceSet] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [isLadderDown, setLadderDown] = useState(false);
	const [ltpIsScrolling, setLTPIsScrolling] = useState(true);

	const selectionMatchedBets = Object.values(matchedBets).filter(order => parseFloat(order.selectionId) === parseFloat(id));
		
	const selectionUnmatchedBets = combineUnmatchedOrders(backList, layList, stopEntryList, tickOffsetList, stopLossList, unmatchedBets)[id];

	const setReferenceSent = useCallback(() => {
		setIsReferenceSet(true);
	}, []);

	const scrollToLTP = useCallback(() => {
		const ltpIndex = ALL_PRICES.findIndex(item => parseFloat(item) === parseFloat(ltp[0]));
		if (listRef.current !== null && listRef.current !== undefined && ltpIndex !== -1) {
			// we do the calculation because we start in reverse
			listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, "center");
			setlistRefSet(true);
		}
	}, [ltp]);

	const resumeLTPScrolling = () => {
		setLTPIsScrolling(true);
	};

	const pauseLTPScrolling =() => {
		setLTPIsScrolling(false);
	};

	// Scroll to the LTP when the ladder first loads
	useEffect(() => {
		setTimeout(() => {
			scrollToLTP();
		}, 1000);
	}, [scrollToLTP]);

	useEffect(() => {
		scrollToLTP();
	}, [isLadderDown, scrollToLTP]);

	// Scroll to LTP when the LTP or order changes
	useEffect(() => {
		if (ltpIsScrolling) scrollToLTP();
	}, [ltp, ltpIsScrolling, order, scrollToLTP]);

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

	const replaceStopLossOrder = useCallback(async ({price, stopLoss}) => {
		if (stopLossList[id]) {
			console.table(stopLoss);
			//! Delete the stop loss if its cell was clicked
			if (stopLoss && stopLoss.actualPos) {
				console.log('hit stop loss');
				console.table(stopLoss);
				await fetch("/api/remove-orders", {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					method: "POST",
					body: JSON.stringify([stopLossList[id]])
				}).then(res => {
					const newStopLossList = Object.assign({}, stopLossList);
					delete newStopLossList[id];

					onChangeStopLossList(newStopLossList);
				});
			} else {
				console.log('didnt hit stop');
				//! Update the stop loss
				const newStopLoss = Object.assign({}, stopLossList[id]);
				newStopLoss.size = stakeVal;
				newStopLoss.price = formatPrice(price);
				newStopLoss.units = stopLossUnits;
				newStopLoss.custom = true;
				newStopLoss.assignedIsOrderMatched = false;
				newStopLoss.strategy = "Stop Loss"
				newStopLoss.tickOffset = 0;
				newStopLoss.hedged = stopLossHedged;
				console.table(newStopLoss);
				console.log('stop loss found...');
				await fetch("/api/remove-orders", {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					method: "POST",
					body: JSON.stringify([stopLossList[id]])
				}).then(async () => {
					console.log('removed old stop loss, now updating...');
					
					await fetch("/api/save-order", {
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json"
						},
						method: "POST",
						body: JSON.stringify(newStopLoss)
					}).then(res => {
						const newStopLossList = Object.assign({}, stopLossList);
						delete newStopLossList[id];
						newStopLossList[id] = newStopLoss;
	
						console.log('new stop loss added...');
						console.table(newStopLossList[id]);
	
						onChangeStopLossList(newStopLossList);
					});
				});	
			}
		}
	}, [id, onChangeStopLossList, stakeVal, stopLossHedged, stopLossList, stopLossUnits]);

	const handleHedgeCellClick = useCallback((marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber) => {
		// if (!PLHedgeNumber) return;

		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);

		console.log('hedge cell should cancel bet depends on this ', unmatchedBetsOnRow);

		// CANCEL ORDER IF CLICK UNMATCHED BET
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
		stopLossUnits, hedgeSize) => {
		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);

		//! Stop Loss and Fill or Kill can't be together, stoploss takes priority
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
					onChangeFillOrKillList(newFillOrKillList);
				}
			}
		});
	}, [fillOrKillList, fillOrKillSeconds, fillOrKillSelected, matchedBets, onChangeTickOffsetList, onChangeFillOrKillList, placeOrder, placeStopLossOrder, stopLossHedged, tickOffsetHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks, tickOffsetTrigger, tickOffsetUnits, unmatchedBets]);



	const cancelSpecialOrder = useCallback(async (order, side) => {
		
		//! Run only if side is undefined or side matches order
		if (!side || side === order.side) {
			//! figure out which strategy it's using and make a new array without it
			switch (order.strategy) {
				case "Back":
					const newBackList = Object.assign({}, backList);
					newBackList[order.selectionId] = newBackList[order.selectionId].filter(item => item.rfs !== order.rfs)
					onChangeBackList(newBackList);

					// onRemoveBackOrder(order);
					break;
				case "Lay":
					const newLayList = Object.assign({}, layList);
					newLayList[order.selectionId] = newLayList[order.selectionId].filter(item => item.rfs !== order.rfs)
					onChangeLayList(newLayList);

					// onRemoveLayOrder(order);
					break;
				case "Stop Entry":
					const newStopEntryList = Object.assign({}, stopEntryList);
					newStopEntryList[order.selectionId] = newStopEntryList[order.selectionId].filter(item => item.rfs !== order.rfs)
					onChangeStopEntryList(newStopEntryList);
					// onRemoveStopEntryOrder(order);
					break;
				case "Tick Offset":
					const newTickOffsetList = Object.assign({}, tickOffsetList);
					delete newTickOffsetList[order.rfs]
					onChangeTickOffsetList(newTickOffsetList)
					// onRemoveTickOffsetOrder(order);
					break;
				case "Stop Loss":
					const newStopLossList = Object.assign({}, stopLossList);
					delete newStopLossList[order.selectionId];
					onChangeStopLossList(newStopLossList)
					// onRemoveStopLossOrder(order);
					break;
				case "None":
					// if we can find something that fits with the fill or kill, we can remove that (this is because we don't make another row for fill or kill)
					if (fillOrKillList[order.betId]) {
						const newFillOrKill = Object.assign({}, fillOrKillList)
						delete newFillOrKill[order.betId];
						onChangeFillOrKillList(newFillOrKill)
						// onRemoveFillOrKillOrder(order);
					}

					console.table('none', {
						marketId: order.marketId,
						betId: order.betId,
						sizeReduction: null,
						matchedBets: matchedBets,
						unmatchedBets: unmatchedBets
					})

					onCancelOrder({
						marketId: order.marketId,
						betId: order.betId,
						sizeReduction: null,
						matchedBets: matchedBets,
						unmatchedBets: unmatchedBets
					});
					break;
				default:


					console.table('default', {
						marketId: order.marketId,
						betId: order.betId,
						sizeReduction: null,
						matchedBets: matchedBets,
						unmatchedBets: unmatchedBets
					})

					onCancelOrder({
						marketId: order.marketId,
						betId: order.betId,
						sizeReduction: null,
						matchedBets: matchedBets,
						unmatchedBets: unmatchedBets
					});
					break;
			}
		}
	}, [fillOrKillList, matchedBets, onCancelOrder, onRemoveBackOrder, onRemoveFillOrKillOrder, onRemoveLayOrder, onRemoveStopEntryOrder, onRemoveStopLossOrder, onRemoveTickOffsetOrder, unmatchedBets]);

	const cancelSpecialOrders = useCallback((order, side) => {
		if (!order && !selectionUnmatchedBets) return;
		let ordersToRemove = [];

		if (order) {
			cancelSpecialOrder(order, side);
			ordersToRemove = ordersToRemove.concat(order);
			
		} else if (selectionUnmatchedBets) {
			console.table(selectionUnmatchedBets);
			Object.values(selectionUnmatchedBets).forEach(rfs => {
				rfs.forEach(order => {
					cancelSpecialOrder(order, side);
					ordersToRemove = ordersToRemove.concat(order);
				});
			});
		}

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
	}, [cancelSpecialOrder, selectionUnmatchedBets]);

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
								handleHedgeCellClick: handleHedgeCellClick,
								replaceStopLossOrder: replaceStopLossOrder,
								layFirstCol: layFirstCol,
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
			<OrderRow 
				matchedBets={selectionMatchedBets}
				unmatchedBets={selectionUnmatchedBets}
				cancelSpecialOrders={cancelSpecialOrders}
			/>
		</LadderContainer>
	);
};

const mapStateToProps = (state, props) => {
	return {
		ltp: getLTP(state.market.ladder, { selectionId: props.id }),
		unmatchedBets: getUnmatchedBets(state.order.bets),
		matchedBets: getMatchedBets(state.order.bets),
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, {
			selectionId: props.id
		}),
		stopLossList: state.stopLoss.list,
		stopLossOffset: state.stopLoss.offset,
		ladderUnmatched: state.settings.ladderUnmatched,
		stakeVal: getStakeVal(state.settings.stake, { selectionId: props.id }),
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
		onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
		
		onRemoveBackOrder: order => dispatch(removeBackOrder(order)),
		onRemoveLayOrder: order => dispatch(removeLayOrder(order)),
		onRemoveStopLossOrder: order => dispatch(removeStopLossOrder(order)),
		onRemoveTickOffsetOrder: order => dispatch(removeTickOffsetOrder(order)),
		onRemoveFillOrKillOrder: order => dispatch(removeFillOrKillOrder(order)),
		onRemoveStopEntryOrder: order => dispatch(removeStopEntryOrder(order)),

		onUpdateBets: bets => dispatch(updateOrders(bets))
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
