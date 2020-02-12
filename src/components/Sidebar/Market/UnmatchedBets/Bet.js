import React, { useCallback, memo } from "react";
import { colorForOrder } from "../../../../utils/Bets/BettingCalculations";
import { twoDecimalPlaces } from "../../../../utils/Bets/BettingCalculations";
import BetPL from "./BetPL";

const Bet = memo(({order, handleRightClick, cancelOrder, marketStartTime}) => {

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
			<BetPL marketStartTime={marketStartTime} order={order} />
		</tr>
	);
});

export default Bet;
