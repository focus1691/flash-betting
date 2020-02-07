import React, { memo, useMemo } from "react";
import { connect } from "react-redux";
import { getUnmatchedBetsOnRow } from "../../selectors/orderSelector";
import { calcHedgeProfit, hedgeStyle } from "../../utils/Bets/HedgeProfit";
import GetUnmatchedStake from "../../utils/Bets/GetUnmatchedStake";

const LadderHedgeCell = ({ marketId, selectionId, price, unmatchedBetsOnRow, side, PLHedgeNumber, handleHedgeCellClick }) => {
	const hedgePL = useMemo(() => calcHedgeProfit(PLHedgeNumber, side), [PLHedgeNumber]);
	const style = useMemo(() => hedgeStyle(unmatchedBetsOnRow, hedgePL), [unmatchedBetsOnRow, hedgePL]);
	const unmatchedStake = useMemo(() => GetUnmatchedStake(unmatchedBetsOnRow), [unmatchedBetsOnRow]);

	return (
		<div
			className="td"
			style={style}
			onClick={handleHedgeCellClick(marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber)}>
			{unmatchedBetsOnRow ? unmatchedStake : hedgePL}
		</div>
	);
};

const mapStateToProps = (state, { selectionId, price, side }) => {
	return {
		unmatchedBetsOnRow: getUnmatchedBetsOnRow(state.order.bets, { selectionId, price, side })
	};
};

const isMoving = (prevProps, nextProps) => {
	if (nextProps.isMoving) {
		return true;
	} else {
		return false;
	}
};

export default connect(mapStateToProps)(memo(LadderHedgeCell, isMoving));
