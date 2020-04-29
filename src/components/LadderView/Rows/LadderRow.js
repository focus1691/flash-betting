import React, { memo, useMemo } from "react";
import { connect } from "react-redux";
import { ALL_PRICES } from "../../../utils/ladder/CreateFullLadder";
import HedgeCell from "../Cells/HedgeCell";
import OddsCell from "../Cells/OddsCell";
import OrderCell from "../Cells/OrderCell";
import VolumeCell from "../Cells/VolumeCell";
import CalculateLadderHedge from "../../../utils/ladder/CalculateLadderHedge";
import { getSelectionMatchedBets } from "../../../selectors/orderSelector";
import { getStakeVal } from "../../../selectors/settingsSelector";
import { getPL } from "../../../selectors/marketSelector";
import { getMatchedSide } from "../../../utils/Bets/GetMatched";
import { isHedgingOnSelectionAvailable } from "../../../utils/TradingStategy/HedingCalculator";

const isMoving = (prevProps, nextProps) => {
	return nextProps.data.isMoving;
};

const LadderRow = memo(({ data: { selectionId, layFirstCol, handleHedgeCellClick, replaceStopLossOrder, isMoving, handlePlaceOrder },
	PL, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, index }) => {

	const key = useMemo(() => ALL_PRICES[ALL_PRICES.length - index - 1], [index]);
	const side = useMemo(() => getMatchedSide(layFirstCol), [layFirstCol]);

	// gets all the bets and returns a hedge or new pl
	const PLHedgeNumber = useMemo(() => selectionMatchedBets.length > 0
		? CalculateLadderHedge(key, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, PL)
		: undefined, [selectionMatchedBets, key, ladderUnmatchedDisplay, stakeVal, PL]);

	// for the stoploss and tickoffset
	const HedgeSize = useMemo(() => selectionMatchedBets.length > 0
		? CalculateLadderHedge(key, selectionMatchedBets, "hedged", stakeVal, PL).size
		: undefined, [selectionMatchedBets, key, stakeVal, PL]);

	const hedgingAvailable = useMemo(() => isHedgingOnSelectionAvailable(selectionMatchedBets), [selectionMatchedBets]);
		
	return (
		<div key={key} onContextMenu={e => e.preventDefault()} className={"tr"} style={style}>
			<VolumeCell selectionId={selectionId} price={key} isMoving={isMoving} />
			<HedgeCell
				selectionId={selectionId}
				price={key}
				side={side.left}
				PLHedgeNumber={PLHedgeNumber}
				hedgingAvailable={hedgingAvailable}
				handleHedgeCellClick={handleHedgeCellClick}
			/>
			<OrderCell
				selectionId={selectionId}
				price={key}
				side={side.left}
				handlePlaceOrder={handlePlaceOrder}
				replaceStopLossOrder={replaceStopLossOrder}
				hedgeSize={HedgeSize}
			/>
			<OddsCell
				selectionId={selectionId}
				price={key}
				isMoving={isMoving}
			/>
			<OrderCell
				selectionId={selectionId}
				price={key}
				side={side.right}
				handlePlaceOrder={handlePlaceOrder}
				replaceStopLossOrder={replaceStopLossOrder}
				hedgeSize={HedgeSize}
			/>
			<HedgeCell
				selectionId={selectionId}
				price={key}
				side={side.right}
				hedgingAvailable={hedgingAvailable}
				PLHedgeNumber={PLHedgeNumber}
				handleHedgeCellClick={handleHedgeCellClick}
			/>
		</div>
	);
}, isMoving);

const mapStateToProps = (state, { data: { selectionId } }) => {
	return {
		ladderUnmatchedDisplay: state.settings.ladderUnmatched,
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
		stakeVal: getStakeVal(state.settings.stake, { selectionId }),
		PL: getPL(state.market.marketPL, { selectionId })
	};
};

export default connect(mapStateToProps)(LadderRow);