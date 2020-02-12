import React, { memo, useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { updateStopLossList } from "../../../actions/stopLoss";
import { getMatched } from "../../../selectors/marketSelector";
import { getStopLoss } from "../../../selectors/stopLossSelector";
import { getTotalMatched, orderStyle} from "../../../utils/Bets/GetMatched";

const isMoving = (prevProps, nextProps) => {
	return nextProps.isMoving;
};

const LadderOrderCell = memo(({side, price, marketId, selectionId, handlePlaceOrder, stopLoss, stopLossData, stopLossUnits, stopLossHedged,
	stopLossSelected, replaceStopLossOrder, hedgeSize, onHover, onLeave, stakeVal, cellMatched}) => {
	
	const totalMatched = useMemo(() => getTotalMatched(cellMatched, null), [cellMatched]);
	const text = useMemo(() => stopLoss ? (stopLoss.stopLoss.hedged ? "H" : stopLoss.stopLoss.size) : totalMatched > 0 ? totalMatched : null, [stopLoss, totalMatched]);
	const style = useMemo(() => orderStyle(side, stopLoss, cellMatched, totalMatched), [side, stopLoss, cellMatched, totalMatched]);

	const handleClick = useCallback(async () => {
		handlePlaceOrder(side, price, marketId, selectionId, stakeVal, stopLossSelected, stopLossData, stopLossUnits, hedgeSize);
	}, [handlePlaceOrder, hedgeSize, marketId, price, selectionId, side, stakeVal, stopLossData, stopLossSelected, stopLossUnits]);

	const handleRightClick = useCallback(async e => {
		e.preventDefault();

		replaceStopLossOrder({price, stopLoss});
	}, [price, replaceStopLossOrder, stopLoss]);
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
		stopLoss: getStopLoss(state.stopLoss.list, props),
		stopLossSelected: state.stopLoss.selected,
		stopLossList: state.stopLoss.list,
		stopLossUnits: state.stopLoss.units,
		stopLossHedged: state.stopLoss.hedged,
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