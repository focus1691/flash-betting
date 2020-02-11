import React, { memo, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { updateStopLossList } from "../../actions/stopLoss";
import { getMatched } from "../../selectors/marketSelector";
import { getUnmatchedBetsOnRow } from "../../selectors/orderSelector";
import { getStopLoss } from "../../selectors/stopLossSelector";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { getTotalMatched, orderStyle} from "../../utils/Bets/GetMatched";

const isMoving = (prevProps, nextProps) => {
	return nextProps.isMoving;
};

const LadderOrderCell = memo(({side, price,  marketId, selectionId, handlePlaceOrder, stopLoss, stopLossData, stopLossUnits,
	changeStopLossList, onChangeStopLossList, stopLossSelected, stopLossList, hedgeSize, onHover, onLeave, stakeVal, cellMatched, cellUnmatched}) => {
	
	const totalMatched = useMemo(() => getTotalMatched(cellMatched, null), [cellMatched]);
	const text = useMemo(() => stopLoss ? (stopLoss.stopLoss.hedged ? "H" : stopLoss.stopLoss.size) : totalMatched > 0 ? totalMatched : null, [stopLoss, totalMatched]);
	const style = useMemo(() => orderStyle(side, stopLoss, cellMatched, totalMatched), [side, stopLoss, cellMatched, totalMatched]);

	const handleClick = useCallback(async e => {
		handlePlaceOrder(side, price, marketId, selectionId, stakeVal, stopLossSelected, stopLossData, stopLossUnits, changeStopLossList, hedgeSize);
	}, [changeStopLossList, handlePlaceOrder, hedgeSize, marketId, price, selectionId, side, stakeVal, stopLossData, stopLossSelected, stopLossUnits]);

	const handleRightClick = useCallback(async e => {
		console.table(stopLoss);
		e.preventDefault();

		if (stopLossList[selectionId]) {
			console.log('stop loss found at this cell. Removing...');
			await fetch("/api/remove-orders", {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				method: "POST",
				body: JSON.stringify([stopLossList[selectionId]])
			}).then(() => {
				const newStopLossList = Object.assign({}, stopLossList);
				delete newStopLossList[selectionId];
				onChangeStopLossList(newStopLossList);
			});
		} else {
			console.log("No stop loss found at this cell. Updating...");
			changeStopLossList({
				marketId: marketId,
				side: side,
				size: stakeVal[selectionId],
				price: formatPrice(price),
				custom: true,
				rfs: undefined,
				assignedIsOrderMatched: false
			});
		}
	}, [changeStopLossList, marketId, price, selectionId, side, stakeVal, stopLoss, stopLossList]);
	return (
		<div
			className="td"
			style={style}
			onMouseEnter={onHover}
			onMouseLeave={onLeave}
			onClick={handleClick}
			onContextMenu={handleRightClick}>
			{text}
		</div>
	);
}, isMoving);

const mapStateToProps = (state, props) => {
	return {
		marketId: state.market.currentMarket.marketId,
		unmatchedBets: state.order.bets.unmatched,
		matchedBets: state.order.bets.matched,
		stopLoss: getStopLoss(state.stopLoss.list, props),
		stopLossSelected: state.stopLoss.selected,
		stopLossList: state.stopLoss.list,
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
		stakeVal: state.settings.stake,
		cellMatched: getMatched(state.market.ladder, props),
		cellUnmatched: getUnmatchedBetsOnRow(state.order.bets, props)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangeStopLossList: list => dispatch(updateStopLossList(list))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LadderOrderCell);