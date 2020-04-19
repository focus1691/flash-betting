import React, { memo, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { setRunner, setDraggingLadder } from "../../actions/market";
import { getLTP, getRunner, getSportId, getPL } from "../../selectors/marketSelector";
import { getSelectionMatchedBets } from "../../selectors/orderSelector";
import { twoDecimalPlaces } from "../../utils/Bets/BettingCalculations";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { getTrainerAndJockey } from "../../utils/Market/GetTrainerAndJockey";
import { calcHedgeAtLTP, calcHedgeSize } from "../../utils/TradingStategy/HedingCalculator";
import { calcOddsOnPriceHover } from "../../utils/Bets/HedgeProfit";
import { marketHasBets } from "../../utils/Bets/GetProfitAndLoss";

const LadderHeader = memo(({ marketId, selectionId, sportId, runner, setRunner, setLadderDown, oddsHovered, ltp, PL, setDraggingLadder, selectionMatchedBets, bets }) => {
	const ordersOnMarket = useMemo(() => marketHasBets(marketId, bets), [bets, marketId]);
	const oddsHoveredCalc = useMemo(() => calcOddsOnPriceHover(oddsHovered.odds, oddsHovered.side, selectionId, oddsHovered.selectionId, PL), [
		PL,
		oddsHovered.odds,
		oddsHovered.selectionId,
		oddsHovered.side,
		selectionId
	]);
	const ladderLTPHedge = useMemo(() => calcHedgeAtLTP(selectionMatchedBets, ltp), [ltp, selectionMatchedBets]);
	const LTPHedgeSize = useMemo(() => calcHedgeSize(selectionMatchedBets, ltp), [selectionMatchedBets, ltp]);

	const handleMouseDown = () => {
		setLadderDown(true);
		setDraggingLadder(selectionId);
	};

	const handleNoImageError = (e) => {
		e.target.onerror = null;
		e.target.src = iconForEvent(parseInt(sportId));
	};

	const runnerSelected = useCallback(() => {
		setRunner(runner);
	}, [runner, setRunner]);

	return (
		<div className={"ladder-header"}>
			<div>
				<h2 className="contender-name" onMouseDown={handleMouseDown}>
					{
						<img
							className={"contender-image"}
							src={
								runner.metadata.COLOURS_FILENAME && parseInt(sportId) === 7
									? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${runner.metadata.COLOURS_FILENAME}`
									: iconForEvent(sportId)
							}
							alt={"Colours"}
							onClick={runnerSelected}
							onError={handleNoImageError}
						/>
					}
					{`${runner.metadata.CLOTH_NUMBER ? runner.metadata.CLOTH_NUMBER + ". " : ""}${runner.runnerName}`}
				</h2>
				<div className="contender-odds-container">
					<span
						className="contender-odds"
						style={{
							display: ordersOnMarket ? "block" : "none",
							color: PL >= 0 ? "rgb(106, 177, 79)" : "red"
						}}>
						{twoDecimalPlaces(PL) || null}
					</span>
					<div className={"contender-details"}>
						<span>{getTrainerAndJockey(runner.metadata)}</span>
					</div>
					<span
						className="contender-odds"
						style={{
							display: oddsHovered.odds > 0 && ordersOnMarket ? "block" : "none",
							color: oddsHoveredCalc >= 0 ? "rgb(106, 177, 79)" : "red"
						}}>
						{twoDecimalPlaces(oddsHoveredCalc)}
					</span>
				</div>
			</div>
			<div>
				<span
					style={{
						display: parseFloat(ladderLTPHedge) === 0 ? "none" : "block",
						color: parseFloat(ladderLTPHedge).toFixed(2) >= 0 ? "rgb(106, 177, 79)" : "red"
					}}>
					{twoDecimalPlaces(ladderLTPHedge)}
				</span>
				<span
					style={{
						display: LTPHedgeSize === 0 ? "none" : "block",
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
		marketId: state.market.currentMarket.marketId,
		sportId: getSportId(state.market.currentMarket),
		runner: getRunner(state.market.runners, { selectionId }),
		ltp: getLTP(state.market.ladder, { selectionId }),
		oddsHovered: state.market.oddsHovered,
		PL: getPL(state.market.marketPL, { selectionId }),
		selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
		bets: state.order.bets
	};
};

const mapDispatchToProps = { setRunner, setDraggingLadder };

export default connect(mapStateToProps, mapDispatchToProps)(LadderHeader);
