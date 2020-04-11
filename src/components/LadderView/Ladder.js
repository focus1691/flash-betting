import crypto from "crypto";
import React, { memo, useMemo, useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { updateBackList } from "../../actions/back";
import { updateLayList } from "../../actions/lay";
import { updateStopLossList } from "../../actions/stopLoss";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { updateStopEntryList } from "../../actions/stopEntry";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { cancelOrders, placeOrder, updateOrders, placeStopLoss, replaceStopLoss, placeTickOffset, placeFillOrKill } from "../../actions/order";
import { getLTP } from "../../selectors/marketSelector";
import { getMatchedBets, getUnmatchedBets } from "../../selectors/orderSelector";
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

const Ladder = memo(({id, ltp, marketStatus, layFirstCol, setLayFirst, placeOrder, updateOrders, order, unmatchedBets, matchedBets, setLadderSideLeft, updateStopLossList, backList, updateBackList, layList, updateLayList, stopLossHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks,
				tickOffsetUnits, tickOffsetTrigger, tickOffsetHedged, fillOrKillSelected, fillOrKillSeconds, fillOrKillList, updateFillOrKillList, stopEntryList, updateStopEntryList, updateTickOffsetList, stopLossOffset, stopLossTrailing, stopLossList, stopLossUnits, stakeVal, draggingLadder, customStakeActive, customStake}) => {
	
	const containerRef = useRef(null);
	const listRef = useRef();
	const [listRefSet, setlistRefSet] = useState(false);
	const [isReferenceSet, setIsReferenceSet] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [isLadderDown, setLadderDown] = useState(false);
	const [ladderLocked, setLadderLocked] = useState(false);
	
	const ladderStyle = useMemo(() => listRefSet ? {paddingRight: `${listRef.current.offsetWidth - listRef.current.clientWidth -17}px`} : "", [listRefSet]);
	const selectionMatchedBets = useMemo(() => Object.values(matchedBets).filter(order => parseFloat(order.selectionId) === parseFloat(id)), [matchedBets, id]);
	const selectionUnmatchedBets = useMemo(() => combineUnmatchedOrders(backList, layList, stopEntryList, tickOffsetList, stopLossList, unmatchedBets)[id], [backList, id, layList, stopEntryList, stopLossList, tickOffsetList, unmatchedBets]);
	
	const setReferenceSent = () => {
		setIsReferenceSet(true);
	};

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
	}, []);

	//* Scroll to the LTP when the ladder order changes
	useEffect(() => {
		if (!ladderLocked) scrollToLTP();
	}, [ltp, draggingLadder, scrollToLTP, ladderLocked]);

	const replaceStopLossOrder = useCallback(async ({price, stopLoss}) => {
		let res = await replaceStopLoss(stopLoss, stopLossList, {
			id,
			stakeVal,
			price: formatPrice(price),
			units: stopLossUnits,
			stopLossHedged: stopLossHedged
		});
		if (res.status) updateStopLossList(res.data);
	}, [id, updateStopLossList, stakeVal, stopLossHedged, stopLossList, stopLossUnits]);

	const handleHedgeCellClick = useCallback(async (marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber) => {
		if (unmatchedBetsOnRow) {

			const data = await cancelOrders(unmatchedBetsOnRow, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side);
			updateBackList(data.back);
			updateLayList(data.lay);
			updateStopLossList(data.stopLoss);
			updateTickOffsetList(data.tickOffset);
			updateStopEntryList(data.stopEntry);
			updateFillOrKillList(data.fillOrKill);

		} else if (PLHedgeNumber && PLHedgeNumber.size > 0) {
			const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);
			const result = placeOrder({
				marketId: marketId,
				side: side,
				size: PLHedgeNumber.size,
				price: price,
				selectionId: selectionId,
				customerStrategyRef: referenceStrategyId,
				unmatchedBets: unmatchedBets,
				matchedBets: matchedBets
			});
			if (result.bets) updateOrders(result.bets);
		}
	}, [backList, fillOrKillList, layList, matchedBets, updateBackList, updateFillOrKillList, updateLayList, updateStopEntryList, updateStopLossList, updateTickOffsetList, placeOrder, updateOrders, stopEntryList, stopLossList, tickOffsetList, unmatchedBets]);

	const handlePlaceOrder = useCallback(async (side, price, marketId, selectionId, stakeVal, stopLossSelected, stopLossData,
		stopLossUnits, hedgeSize) => {
		const referenceStrategyId = crypto.randomBytes(15).toString("hex").substring(0, 15);
		const betSize = (customStakeActive && customStake) ? customStake : stakeVal[selectionId];
		//* Place the order first with BetFair and then execute the tools
		// //! Tool priority: 1) Stop Loss 2) Tick Offset 3) Fill or Kill
		const result = await placeOrder({
			side: side,
			price: formatPrice(price),
			marketId: marketId,
			selectionId: selectionId,
			customerStrategyRef: referenceStrategyId,
			unmatchedBets: unmatchedBets,
			matchedBets: matchedBets,
			size: betSize,
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
						size: betSize,
						betId: betId,
						hedged: stopLossHedged,
						strategy: "Stop Loss",
					}, stopLossList);
					if (sl.status) updateStopLossList(sl.data);
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
						size: tickOffsetHedged ? hedgeSize : betSize,
						side: side === "BACK" ? "LAY" : "BACK",
						percentageTrigger: tickOffsetTrigger,
						rfs: referenceStrategyId,
						betId: betId,
						hedged: tickOffsetHedged,
						minFillSize: fillOrKillSelected ? (tickOffsetHedged ? hedgeSize : stakeVal[selectionId]) : 1
					}, tickOffsetList);
					if (tos) updateTickOffsetList(tos.data);
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
					}, fillOrKillList);
					if (fok.isSaved) updateFillOrKillList(fok.data);
				}
			}
		});
		if (result.bets) updateOrders(result.bets);
	}, [placeOrder, unmatchedBets, matchedBets, updateOrders, tickOffsetSelected, fillOrKillSelected, id, stopLossOffset, stopLossHedged, stopLossList, updateStopLossList, tickOffsetTicks, tickOffsetUnits, tickOffsetHedged, tickOffsetTrigger, tickOffsetList, updateTickOffsetList, fillOrKillSeconds, fillOrKillList, updateFillOrKillList]);

	const cancelSpecialOrders = useCallback(async (order, side) => {
		let betsToPass = order ? order : selectionUnmatchedBets ? selectionUnmatchedBets : null;

		if (betsToPass) {
			const data = await cancelOrders(betsToPass, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side);

			updateBackList(data.back);
			updateLayList(data.lay);
			updateStopLossList(data.stopLoss);
			updateTickOffsetList(data.tickOffset);
			updateStopEntryList(data.stopEntry);
			updateFillOrKillList(data.fillOrKill);
		}
	}, [backList, fillOrKillList, layList, updateBackList, updateFillOrKillList, updateLayList, updateStopEntryList, updateStopLossList, updateTickOffsetList, selectionUnmatchedBets, stopEntryList, stopLossList, tickOffsetList]);

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
			marketStatus={marketStatus} >
			<Header selectionId={id} setLadderDown={setLadderDown} ladderLocked={ladderLocked} setLadderLocked={setLadderLocked} />

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
							style={ladderStyle}
							itemData={{
								selectionId: id,
								handlePlaceOrder: handlePlaceOrder,
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
		ladderUnmatched: state.settings.ladderUnmatched,
		stakeVal: getStakeVal(state.settings.stake, { selectionId: props.id }),
		customStake: state.market.runners[props.id].order.customStake,
		customStakeActive: state.market.runners[props.id].order.customStakeActive,
		draggingLadder: state.market.draggingLadder,

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

const mapDispatchToProps = { placeOrder, updateOrders, updateBackList, updateLayList, updateStopLossList, updateTickOffsetList, updateFillOrKillList, updateStopEntryList };

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);