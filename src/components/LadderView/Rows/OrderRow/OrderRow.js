import React, { memo, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { changePriceType } from "../../../../actions/market";
import { MatchedBet } from "./MatchedBet";
import { UnmatchedBet } from "./UnmatchedBet";

const OrderRow = memo(({matchedBets, unmatchedBets, cancelSpecialOrders, priceType, changePriceType}) => {

	const unmatchedBetsArr = useMemo(() => unmatchedBets ? Object.values(unmatchedBets) : [], [unmatchedBets]);
	const matchedStyle = useMemo(() => matchedBets.length > 0 ? "lay-body" : "", [matchedBets.length]);
	const unmatchedStyle = useMemo(() => unmatchedBetsArr.length > 0 ? "lay-body" : "", [unmatchedBetsArr.length]);

	const cancelUnmatchedOrder = useCallback(order => {
		cancelSpecialOrders(order);
	}, [cancelSpecialOrders]);

	const cancelAllOrdersOnSelection = useCallback(async () => {
		cancelSpecialOrders();
	}, [cancelSpecialOrders]);

	const handleButtonClick = useCallback(() => {
		changePriceType(priceType === "STAKE" ? "LIABILITY" : "STAKE");
	}, [priceType, changePriceType]);

	return (
		<div className={"order-row"}>
			<table>
				<tbody>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className={unmatchedStyle}>
								{unmatchedBetsArr.map(rfs => rfs.map((bet, id) => {
									return (
										<UnmatchedBet
											key={`ladder-matched-bet-${bet.selectionId}-${bet.rfs}-${id}`}
											bet={bet}
											cancelBet={cancelUnmatchedOrder} />
									);
								}))}
							</tbody>
						</table>
					</td>
					<td colSpan={1} rowSpan={4} style={{ verticalAlign: "top", minHeight: "1.675em" }}>
						<button>0</button>
						<button onClick={handleButtonClick}>
							{priceType === "STAKE" ? "S" : "L"}
						</button>
						<button
							onClick={cancelAllOrdersOnSelection}>
							K
						</button>
					</td>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className={matchedStyle}>
								{matchedBets.map((bet, idx) => {
									return (
										<MatchedBet
											key={`ladder-matched-bet-${bet.selectionId}-${idx}`}
											bet={bet} index={idx} />
									);
								})}
							</tbody>
						</table>
					</td>
				</tbody>
			</table>
		</div>
	);
});

const mapStateToProps = state => {
	return {
		priceType: state.market.priceType
	};
};

const mapDispatchToProps = { changePriceType };

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);