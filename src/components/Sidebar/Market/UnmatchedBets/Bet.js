import React, { memo, useCallback, useState, useEffect } from "react";
import { getStrategyAbbreviation, colorForOrder, PLColor } from "../../../../utils/Bets/BettingCalculations";
import { twoDecimalPlaces, getStrategySuffixForPL } from "../../../../utils/Bets/BettingCalculations";

const Bet = memo(({order, handleRightClick, cancelOrder, marketStartTime}) => {
    const [PL, setPL] = useState("");

    useEffect(() => {
        let suffix = getStrategyAbbreviation(order.trailing, order.hedged);
        setPL(getStrategySuffixForPL(order, suffix, marketStartTime));

    }, [marketStartTime, order]);

    const handleClick = useCallback(() => {
        cancelOrder(order);
    }, [cancelOrder, order]);

	return (
		<tr
			id="menu-unmatched-bet"
			style={colorForOrder(order.side, order.strategy)}
			onContextMenu={e => {
				e.preventDefault();
				handleRightClick(order);
			}}>
			<button className={"cancel-order-btn"} style={{ height: "22px", width: "auto" }} onClick={handleClick}>
				<img src={`${window.location.origin}/icons/error.png`} alt="X" />
			</button>
			<td>{twoDecimalPlaces(order.price)}</td>
			<td>{order.size}</td>
			<td id="pl-style" style={PLColor(PL)}>
				{PL}
			</td>
		</tr>
	);
});

export default Bet;
