import React, { memo } from "react";
import { twoDecimalPlaces, getStrategyAbbreviation, getStrategySuffix, colorForOrder } from "../../../../utils/Bets/BettingCalculations";

const UnmatchedBet = memo(({bet, cancelBet}) => {
	const strategyAbbreviation = getStrategyAbbreviation(bet.trailing, bet.hedged);
	const strategySuffix = getStrategySuffix(bet.strategy, bet.stopEntryCondition, bet.targetLTP, strategyAbbreviation);

    const handleClick = () => {
        cancelBet(bet);
	};

	return (
		<tr
			style={colorForOrder(bet.side, bet.strategy)}>
			<td>
				<img
					className={"cancel-order-btn-2"}
					src={`${window.location.origin}/icons/error.png`}
					alt="X"
					style={{ cursor: "pointer" }}
					onClick={handleClick}
				/>
				{`${bet.size} @ ${twoDecimalPlaces(bet.price)} ${strategySuffix}`}
			</td>
		</tr>
	);
});

export { UnmatchedBet };
