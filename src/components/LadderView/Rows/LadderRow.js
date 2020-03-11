import React, { memo, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { setOddsHovered } from "../../../actions/market";
import { ALL_PRICES } from "../../../utils/ladder/CreateFullLadder";
import HedgeCell from "../Cells/HedgeCell";
import OddsCell from "../Cells/OddsCell";
import OrderCell from "../Cells/OrderCell";
import VolumeCell from "../Cells/VolumeCell";
import GetQueryVariable from "../../../utils/Market/GetQueryVariable";
import CalculateLadderHedge from "../../../utils/ladder/CalculateLadderHedge";
import { getSelectionMatchedBets } from "../../../selectors/orderSelector";
import { getStakeVal } from "../../../selectors/settingsSelector";
import { getPL } from "../../../selectors/marketSelector";
import { getMatchedSide } from "../../../utils/Bets/GetMatched";

const isMoving = (prevProps, nextProps) => {
	return nextProps.data.isMoving;
};

const LadderRow = memo(({ data: { selectionId, layFirstCol, handleHedgeCellClick, replaceStopLossOrder, isMoving, handlePlaceOrder },
	PL, onOddsHovered, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, index }) => {

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

	const handleContextMenu = useCallback(e => {
		e.preventDefault();
		return false;
	}, []);

	const marketId = GetQueryVariable("marketId");

	return (
		<div key={key} onContextMenu={handleContextMenu} className={"tr"} style={style}>
			<VolumeCell selectionId={selectionId} price={key} isMoving={isMoving} />
			<HedgeCell
				marketId={marketId}
				selectionId={selectionId}
				price={key}
				PLHedgeNumber={PLHedgeNumber}
				side={side.left}
				handleHedgeCellClick={handleHedgeCellClick}
				isMoving={isMoving}
			/>
			<OrderCell
				side={side.left}
				selectionId={selectionId}
				price={key}
				handlePlaceOrder={handlePlaceOrder}
				replaceStopLossOrder={replaceStopLossOrder}
				// we do this because we want the hedge, not the pl
				hedgeSize={HedgeSize}
				onHover={onOddsHovered({ selectionId, odds: key, side: side.left })}
				onLeave={onOddsHovered({ selectionId, odds: 0, side: side.left })}
				isMoving={isMoving}
			/>
			<OddsCell
				selectionId={selectionId}
				price={key}
				isMoving={isMoving}
			/>
			<OrderCell
				side={side.right}
				selectionId={selectionId}
				price={key}
				handlePlaceOrder={handlePlaceOrder}
				replaceStopLossOrder={replaceStopLossOrder}
				// we do this because we want the hedge, not the pl
				hedgeSize={HedgeSize}
				onHover={onOddsHovered({ selectionId, odds: key, side: side.right })}
				onLeave={onOddsHovered({ selectionId, odds: 0, side: side.right })}
				isMoving={isMoving}
			/>
			<HedgeCell
				marketId={marketId}
				selectionId={selectionId}
				price={key}
				side={side.right}
				PLHedgeNumber={PLHedgeNumber}
				handleHedgeCellClick={handleHedgeCellClick}
				isMoving={isMoving}
			/>
		</div>
	);
}, isMoving);

const mapStateToProps = (state, { data: { selectionId }, index }) => {
	return {
		ladderUnmatchedDisplay: state.settings.ladderUnmatched,
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
		stakeVal: getStakeVal(state.settings.stake, { selectionId }),
		PL: getPL(state.market.marketPL, { selectionId })
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onOddsHovered: odds => e => dispatch(setOddsHovered(odds))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LadderRow);
