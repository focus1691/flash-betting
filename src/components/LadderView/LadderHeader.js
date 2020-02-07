import React, { memo, useMemo } from "react";
import { connect } from "react-redux";
import { setRunner, setDraggingLadder } from "../../actions/market";
import { getLTP, getRunner, getSportId, getPL } from "../../selectors/marketSelector";
import { getMatchedBets, getUnmatchedBets, getSelectionMatchedBets } from "../../selectors/orderSelector";
import { twoDecimalPlaces } from "../../utils/Bets/BettingCalculations";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { getTrainerAndJockey } from "../../utils/Market/GetTrainerAndJockey";
import { calcHedgeAtLTP, calcHedgeSize } from "../../utils/TradingStategy/HedingCalculator";
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";
import { calcOddsOnPriceHover } from "../../utils/Bets/HedgeProfit";

const LadderHeader = memo(({selectionId, sportId, runner, onSelectRunner, setLadderDown, oddsHovered, ltp, PL, onDraggingLadder, selectionMatchedBets}) => {

	const ordersOnMarket = useMemo(() => selectionMatchedBets.length > 0, [selectionMatchedBets.length]);
	const oddsHoveredCalc = useMemo(() => calcOddsOnPriceHover(oddsHovered.odds, oddsHovered.side, selectionId, oddsHovered.selectionId, PL), [PL, oddsHovered.odds, oddsHovered.selectionId, oddsHovered.side, selectionId]);
	const ladderLTPHedge = useMemo(() => calcHedgeAtLTP(selectionMatchedBets, ltp),[ltp, selectionMatchedBets]);
	const LTPHedgeSize = useMemo(() => calcHedgeSize(selectionMatchedBets, ltp), [selectionMatchedBets, ltp]);

	const handleMouseDown = () => e => {
		setLadderDown(true);
		onDraggingLadder(selectionId);
	};

	const handleNoImageError = () => e => {
		e.target.onerror = null;
		e.target.src = iconForEvent(parseInt(sportId));
	};

	return (
		<div className={"ladder-header"}>
			<div>
				<h2 className="contender-name" onMouseDown={handleMouseDown()}>
					{
						<img
							className={"contender-image"}
							src={
								runner.metadata.COLOURS_FILENAME && parseInt(sportId) === 7
									? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
									: iconForEvent(sportId)
							}
							alt={"Colours"}
							onClick={onSelectRunner(runner)}
							onError={handleNoImageError()}
						/>
					}
					{`${runner.metadata.CLOTH_NUMBER ? runner.metadata.CLOTH_NUMBER + ". " : ""}${runner.runnerName}`}
				</h2>
				<div className="contender-odds-container">
					<span
						className="contender-odds"
						style={{
							visibility: ordersOnMarket ? "visible" : "hidden",
							color: PL >= 0 ? "rgb(106, 177, 79)" : "red"
						}}>
						{twoDecimalPlaces(PL)}
					</span>
					<div className={"contender-details"}>
						<span>{getTrainerAndJockey(runner.metadata)}</span>
					</div>
					<span
						className="contender-odds"
						style={{
							visibility: oddsHovered.odds > 0 && ordersOnMarket ? "visible" : "hidden",
							color: oddsHoveredCalc >= 0 ? "rgb(106, 177, 79)" : "red"
						}}>
						{twoDecimalPlaces(oddsHoveredCalc)}
					</span>
				</div>
			</div>
			<div>
				<span
					style={{
						visibility: parseFloat(ladderLTPHedge) === 0 ? "hidden" : "visible",
						color: parseFloat(ladderLTPHedge).toFixed(2) >= 0 ? "rgb(106, 177, 79)" : "red"
					}}>
					{twoDecimalPlaces(ladderLTPHedge)}
				</span>
				<span
					style={{
						visibility: LTPHedgeSize === 0 ? "hidden" : "visible",
						color: parseFloat(LTPHedgeSize).toFixed(2) >= 0 ? "#88c6f7" : "red"
					}}
					id="ltphedgesize">
					{twoDecimalPlaces(LTPHedgeSize)}
				</span>
			</div>
		</div>
	);
});

const mapStateToProps = (state, { selectionId }) => {
	return {
		market: state.market.currentMarket,
		sportId: getSportId(state.market.currentMarket),
		runner: getRunner(state.market.runners, { selectionId }),
		unmatchedBets: getUnmatchedBets(state.order.bets),
		matchedBets: getMatchedBets(state.order.bets),
		ltp: getLTP(state.market.ladder, { selectionId }),
		oddsHovered: state.market.oddsHovered,
		PL: getPL(state.market.marketPL, { selectionId }),
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId })
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSelectRunner: runner => e => dispatch(setRunner(runner)),
		onDraggingLadder: drag => dispatch(setDraggingLadder(drag))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LadderHeader);
