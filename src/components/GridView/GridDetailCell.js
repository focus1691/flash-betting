import crypto from "crypto";
import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import { setRunner } from "../../actions/market";
import { placeOrder } from "../../actions/order";
import { calcBackProfit } from "../../utils/Bets/BettingCalculations";
import { selectionHasBets } from "../../utils/Bets/SelectionHasBets";
import CalculateLadderHedge from "../../utils/ladder/CalculateLadderHedge";
import { iconForEvent } from "../../utils/Market/EventIcons";
import { isHedgingOnSelectionAvailable } from "../../utils/TradingStategy/HedingCalculator";

const GridDetailCell = ({ setRunner, placeOrder, sportId, market, runner, name, number, logo, ltp, tv, bets, PL, hedge, ltpStyle }) => {
	const selectionMatchedBets = Object.values(bets.matched).filter(
		bet => parseInt(bet.selectionId) === parseInt(runner.selectionId)
	);

	const side = useMemo(() =>  selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === "BACK" ? 0 : 1), 0) <= 0 ? "BACK" : "LAY", [selectionMatchedBets]);

	const handleImageError = () => e => {
		e.target.onerror = null;
		e.target.src = iconForEvent(parseInt(sportId));
	};

	const executeHedgeBet = () => e => {
		if (isHedgingOnSelectionAvailable(market.marketId, runner.selectionId, bets)) {
			const referenceStrategyId = crypto
				.randomBytes(15)
				.toString("hex")
				.substring(0, 15);
			const hedgeSize =
				selectionMatchedBets.length > 0
					? CalculateLadderHedge(ltp[0], selectionMatchedBets, "hedged").size
					: undefined;

			placeOrder({
				marketId: market.marketId,
				side: side,
				size: hedgeSize,
				price: ltp[0],
				selectionId: runner.selectionId,
				customerStrategyRef: referenceStrategyId,
				unmatchedBets: bets.unmatched,
				matchedBets: bets.matched
			});
		}
	};

	const handleRunnerSelection = useCallback(() => {
		setRunner(runner);
	}, [runner]);

	return (
		<td className="grid-runner-details" onClick={handleRunnerSelection}>
			<img src={logo} alt={""} onError={handleImageError()} />
			<span>{`${number}${name}`}</span>
			<span style={ltpStyle}>{ltp[0] ? ltp[0] : ""}</span>

			<div className={"grid-pl"}>
				<span
					style={{
						color: !isHedgingOnSelectionAvailable(market.marketId, runner.selectionId, bets)
							? "#D3D3D3"
							: hedge < 0
							? "red"
							: "#01CC41"
					}}
					onClick={executeHedgeBet()}>
					{selectionHasBets(market.marketId, runner.selectionId, bets) ? hedge : ""}
				</span>
				<span style={{ color: PL.color }}>{PL.val}</span>
				<span>{tv[0] ? Math.floor(tv[0]).toLocaleString() : ""}</span>
			</div>
		</td>
	);
};

const mapDispatchToProps = { setRunner, placeOrder };

export default connect(null, mapDispatchToProps)(GridDetailCell);