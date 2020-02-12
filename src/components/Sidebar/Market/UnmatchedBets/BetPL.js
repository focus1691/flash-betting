import React, { useState, useEffect } from "react";
import { getStrategyAbbreviation, PLColor } from "../../../../utils/Bets/BettingCalculations";
import { getStrategySuffixForPL } from "../../../../utils/Bets/BettingCalculations";

export default ({order, marketStartTime}) => {
    const [PL, setPL] = useState("");

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setPL(getStrategySuffixForPL(order, getStrategyAbbreviation(order.trailing, order.hedged), marketStartTime));
        }, 500);
        return () => {
            clearInterval(countdownInterval);
        }

    }, [marketStartTime, order]);

	return (
		<td id="pl-style" style={PLColor(PL)}>
			{PL}
		</td>
	); 
};
