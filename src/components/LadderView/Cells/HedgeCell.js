import React, { memo, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { getUnmatchedBetsOnRow } from "../../../selectors/orderSelector";
import { calcHedgeProfit, hedgeStyle } from "../../../utils/Bets/HedgeProfit";
import GetUnmatchedStake from "../../../utils/Bets/GetUnmatchedStake";

const isMoving = (prevProps, nextProps) => {
	return nextProps.isMoving;
};

const LadderHedgeCell = memo(({ marketId, selectionId, price, unmatchedBetsOnRow, side, hedgingAvailable, PLHedgeNumber, handleHedgeCellClick }) => {
	const hedgePL = useMemo(() => calcHedgeProfit(PLHedgeNumber, side), [PLHedgeNumber, side]);
	const style = useMemo(() => hedgeStyle(unmatchedBetsOnRow, hedgePL), [unmatchedBetsOnRow, hedgePL]);
	const unmatchedStake = useMemo(() => GetUnmatchedStake(unmatchedBetsOnRow), [unmatchedBetsOnRow]);
	const text = useMemo(() => unmatchedStake > 0 ? unmatchedStake : hedgingAvailable ? hedgePL : null, [unmatchedStake, hedgingAvailable, hedgePL]);

	const handleClick = useCallback(() => {
		handleHedgeCellClick(marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber);
	}, [handleHedgeCellClick, marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber]);

	return (
		<div
			className="td"
			style={style}
			onClick={handleClick}>
			{text}
		</div>
	);
});

const mapStateToProps = (state, { selectionId, price, side }) => {
	return {
		marketId: state.market.currentMarket.marketId,
		unmatchedBetsOnRow: getUnmatchedBetsOnRow(state.order.bets, { selectionId, price, side })
	};
};

export default connect(mapStateToProps)(LadderHedgeCell);
