import React, { memo, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { updateStopLossList } from "../../../actions/stopLoss";
import { getMatched } from "../../../selectors/marketSelector";
import { getStopLoss } from "../../../selectors/stopLossSelector";
import { getTickOffset } from "../../../selectors/tickOffsetSelector";
import { getTotalMatched, orderStyle, textForOrderCell } from "../../../utils/Bets/GetMatched";

const isMoving = (prevProps, nextProps) => {
	return nextProps.isMoving;
};

const LadderOrderCell = memo(({side, price, marketId, selectionId, handlePlaceOrder, stopLoss, stopLossUnits,
	stopLossSelected, tickOffset, replaceStopLossOrder, hedgeSize, onHover, onLeave, stakeVal, cellMatched}) => {
	
	const totalMatched = useMemo(() => getTotalMatched(cellMatched, null), [cellMatched]);
	const orderText = useMemo(() => textForOrderCell(stopLoss, totalMatched), [stopLoss, totalMatched]);
	const style = useMemo(() => orderStyle(side, stopLoss, tickOffset, cellMatched, totalMatched), [side, stopLoss, tickOffset, cellMatched, totalMatched]);

	const handleClick = useCallback(async () => {
		handlePlaceOrder(side, price, marketId, selectionId, stakeVal, stopLossSelected, !!stopLoss, stopLossUnits, hedgeSize);
	}, [handlePlaceOrder, hedgeSize, marketId, price, selectionId, side, stakeVal, stopLoss, stopLossSelected, stopLossUnits]);

	const handleRightClick = useCallback(async e => {
		e.preventDefault();

		replaceStopLossOrder({price, stopLoss});
	}, [price, replaceStopLossOrder, stopLoss]);
	return (
		<div className="td"
			 style={style}
			 onMouseEnter={onHover}
			 onMouseLeave={onLeave}
			 onClick={handleClick}
			 onContextMenu={handleRightClick}>
			 {orderText}
		</div>
	);
}, isMoving);

const mapStateToProps = (state, props) => {
	return {
		marketId: state.market.currentMarket.marketId,
		stopLoss: getStopLoss(state.stopLoss.list, props),
		stopLossSelected: state.stopLoss.selected,
		stopLossUnits: state.stopLoss.units,
		tickOffset: getTickOffset(state.tickOffset.list, props),
		stakeVal: state.settings.stake,
		cellMatched: getMatched(state.market.ladder, props)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangeStopLossList: list => dispatch(updateStopLossList(list))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LadderOrderCell);