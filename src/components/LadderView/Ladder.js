import crypto from "crypto";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { updateBackList } from "../../actions/back";
import { updateLayList } from "../../actions/lay";
import { updateStopLossList } from "../../actions/stopLoss";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateStopEntryList } from "../../actions/stopEntry";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { cancelOrder, cancelOrders, placeOrder, updateOrders, placeStopLoss, replaceStopLoss, placeTickOffset, placeFillOrKill } from "../../actions/order";
import { getLTP } from "../../selectors/marketSelector";
import { getMatchedBets, getSelectionMatchedBets, getUnmatchedBets } from "../../selectors/orderSelector";
import { combineUnmatchedOrders } from "../../utils/Bets/CombineUnmatchedOrders";
import { getStakeVal } from "../../selectors/settingsSelector";
import { ALL_PRICES, formatPrice } from "../../utils/ladder/CreateFullLadder";
import { findTickOffset } from "../../utils/TradingStategy/TickOffset";
import { findStopPosition } from "../../utils/TradingStategy/StopLoss";
import Container from "./Container";
import Header from "./Header";
import LadderRow from "./Rows/LadderRow";
import OrderRow from "./Rows/OrderRow/OrderRow";
import PercentageRow from "./Rows/PercentageRow/PercentageRow";
import PriceRow from "./Rows/PriceRow";

const isMoving = (prevProps, nextProps) => {
	if (nextProps.draggingLadder === nextProps.id && prevProps.order === nextProps.order) {
		return true;
	} else {
		return false;
	}
};

const Ladder = memo(({id, ltp, marketStatus, layFirstCol, setLayFirst, onPlaceOrder, onUpdateOrders, onCancelOrder, order, unmatchedBets, matchedBets, setLadderSideLeft, onChangeStopLossList, backList, onChangeBackList, layList, onChangeLayList, stopLossHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks,
				tickOffsetUnits, tickOffsetTrigger, tickOffsetHedged, fillOrKillSelected, fillOrKillSeconds, fillOrKillList, onChangeFillOrKillList, stopEntryList, onChangeStopEntryList, onChangeTickOffsetList, stopLossOffset, stopLossTrailing, stopLossList, stopLossUnits, stakeVal, stopLoss, ladderOrderList}) => {
	
	const containerRef = useRef(null);
	const listRef = useRef();
	const [listRefSet, setlistRefSet] = useState(false);
	const [isReferenceSet, setIsReferenceSet] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [isLadderDown, setLadderDown] = useState(false);

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

	//* Scroll to the LTP when the ladder first loads
	useEffect(() => {
		setTimeout(() => {
			scrollToLTP();
		}, 1000);
	}, [scrollToLTP]);

	//* Scroll to the LTP when the ladder order changes
	useEffect(() => {
		scrollToLTP();
	}, [ltp, ladderOrderList, scrollToLTP]);

	const replaceStopLossOrder = useCallback(async ({price, stopLoss}) => {
		let res = await replaceStopLoss(stopLoss, stopLossList, {
			id,
			stakeVal,
			price: formatPrice(price),
			units: stopLossUnits,
			stopLossHedged: stopLossHedged
		});
		if (res.status) onChangeStopLossList(res.data);
	}, [id, onChangeStopLossList, stakeVal, stopLossHedged, stopLossList, stopLossUnits]);

	const handleHedgeCellClick = useCallback((marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber) => {

		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);
		if (unmatchedBetsOnRow) {
			const betIdsToCancel = unmatchedBetsOnRow.map(unmatchedBet => unmatchedBet.betId);
				onCancelOrder({
					marketId: marketId,
					betId: betIdsToCancel,
					sizeReduction: null,
					matchedBets: matchedBets,
					unmatchedBets: unmatchedBets
			});
		} else if (PLHedgeNumber && PLHedgeNumber.size > 0) {
			onPlaceOrder({
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
	}, [matchedBets, onCancelOrder, onPlaceOrder, unmatchedBets]);

	const handlePlaceOrder = useCallback(async (side, price, marketId, selectionId, stakeVal, stopLossSelected, stopLossData,
		stopLossUnits, hedgeSize) => {
		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);
		
		//* Place the order first with BetFair and then execute the tools
		//! Tool priority: 1) Stop Loss 2) Tick Offset 3) Fill or Kill
		const result = await onPlaceOrder({
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
					let sl = await placeStopLoss({
						marketId: marketId,
						selectionId: parseInt(id),
						side: side === "BACK" ? "LAY" : "BACK",
						price: findStopPosition(price, stopLossOffset, side),
						custom: false,
						units: stopLossUnits,
						rfs: referenceStrategyId,
						assignedIsOrderMatched: false,
						size: stakeVal[selectionId],
						betId: betId,
						hedged: stopLossHedged,
						strategy: "Stop Loss",
					}, stopLossList);
					if (sl.status) onChangeStopLossList(sl.data);
				}
				else if (tickOffsetSelected) {
					let tos = await placeTickOffset({
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
					}, tickOffsetList);
					if (tos) onChangeTickOffsetList(tos.data);
				}

				if (!stopLossSelected && fillOrKillSelected) {
					let fok = await placeFillOrKill({
						strategy: "Fill Or Kill",
						marketId: marketId,
						selectionId: selectionId,
						seconds: fillOrKillSeconds,
						startTime: Date.now(),
						betId: betId,
						rfs: referenceStrategyId
					});
					onChangeFillOrKillList(fok.data);
				}
			}
		});
		if (result) onUpdateOrders(result.bets);
	}, [onPlaceOrder, unmatchedBets, matchedBets, onUpdateOrders, tickOffsetSelected, fillOrKillSelected, id, stopLossOffset, stopLossHedged, stopLossList, onChangeStopLossList, tickOffsetTicks, tickOffsetUnits, tickOffsetHedged, tickOffsetTrigger, tickOffsetList, onChangeTickOffsetList, fillOrKillSeconds, onChangeFillOrKillList]);

	const cancelSpecialOrders = async (order, side) => {
		let betsToPass = order ? order : selectionUnmatchedBets ? selectionUnmatchedBets : null;

		if (betsToPass) {
			const data = await cancelOrders(betsToPass, matchedBets, unmatchedBets, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side);

			console.log('ladder ', data.stopLoss);
			onChangeBackList(data.back);
			onChangeLayList(data.lay);
			onChangeStopLossList(data.stopLoss);
			onChangeTickOffsetList(data.tickOffset);
			onChangeStopEntryList(data.stopEntry);
			onChangeFillOrKillList(data.fillOrKill);
			// onUpdateOrders(data.bets);
		}
	};

	return (
		<Container
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
			<Header selectionId={id} setLadderDown={setLadderDown} />

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
								isMoving: isMoving
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
		</Container>
	);
}, isMoving);

const mapStateToProps = (state, props) => {
	return {
		ltp: getLTP(state.market.ladder, { selectionId: props.id }),
		unmatchedBets: getUnmatchedBets(state.order.bets),
		matchedBets: getMatchedBets(state.order.bets),
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, {
			selectionId: props.id
		}),
		ladderUnmatched: state.settings.ladderUnmatched,
		stakeVal: getStakeVal(state.settings.stake, { selectionId: props.id }),
		draggingLadder: state.market.draggingLadder,
		ladderOrderList: state.market.ladderOrder,

		//* Back/Lay
		layList: state.lay.list,
		backList: state.back.list,
		
		//* SL
		stopLossList: state.stopLoss.list,
		stopLossOffset: state.stopLoss.offset,
		stopLossSelected: state.stopLoss.selected,
		stopLossUnits: state.stopLoss.units,
		stopLossHedged: state.stopLoss.hedged,

		//* TO
		tickOffsetList: state.tickOffset.list,
		tickOffsetSelected: state.tickOffset.selected,
		tickOffsetTicks: state.tickOffset.ticks,
		tickOffsetUnits: state.tickOffset.units,
		tickOffsetTrigger: state.tickOffset.percentTrigger,
		tickOffsetHedged: state.tickOffset.hedged,

		//* FOK
		fillOrKillSelected: state.fillOrKill.selected,
		fillOrKillSeconds: state.fillOrKill.seconds,
		fillOrKillList: state.fillOrKill.list,

		//* SE
		stopEntryList: state.stopEntry.list
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onPlaceOrder: order => dispatch(placeOrder(order)),
		onUpdateOrders: orders => dispatch(updateOrders(orders)),
		onCancelOrder: order => dispatch(cancelOrder(order)),
		onChangeBackList: list => dispatch(updateBackList(list)),
		onChangeLayList: list => dispatch(updateLayList(list)),
		onChangeStopLossList: list => dispatch(updateStopLossList(list)),
		onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
		onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
		onChangeStopEntryList: list => dispatch(updateStopEntryList(list))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);