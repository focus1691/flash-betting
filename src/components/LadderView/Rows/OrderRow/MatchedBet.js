import React, { memo, useMemo } from "react";
import { twoDecimalPlaces } from "../../../../utils/Bets/BettingCalculations";

const MatchedBet = memo(({ bet, index }) => {
    
    const style = useMemo(() => {
        return {
            backgroundColor: bet.side === "BACK" ? "#A6D8FF" : "#FAC9D7"
        }
    }, [bet.side]);


	return (
		<tr
			style={style}>
			<td>{`${bet.size} @ ${twoDecimalPlaces(bet.price)}`}</td>
		</tr>
	);
});

export { MatchedBet };
