import React, { memo, useMemo, useCallback } from "react";
import { connect } from "react-redux";
import { changePriceType } from "../../../../actions/market";
import { MatchedBet } from "./MatchedBet";
import { UnmatchedBet } from "./UnmatchedBet";

const OrderRow = memo(({matchedBets, unmatchedBets, cancelSpecialOrders, priceType, onChangePriceType}) => {

	const unmatchedBetsArr = useMemo(() => unmatchedBets ? Object.values(unmatchedBets) : [], [unmatchedBets]);

	const unmatchedStyle = useMemo(() => unmatchedBetsArr.length > 0 ? "lay-body" : "", [unmatchedBetsArr.length]);

	const cancelUnmatchedOrder = useCallback(order => {
		cancelSpecialOrders(order);
	}, [cancelSpecialOrders]);

	const cancelAllOrdersOnSelection = useCallback(async () => {
		cancelSpecialOrders(null, null);
	}, [cancelSpecialOrders]);

	return (
		<div className={"order-row"}>
			<table>
				<tbody>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className={unmatchedStyle}>
								{unmatchedBetsArr.map(rfs => rfs.map(bet => {
									return <UnmatchedBet bet={bet} cancelBet={cancelUnmatchedOrder} />
								}))}
							</tbody>
						</table>
					</td>
					<td colSpan={1} rowSpan={4} style={{ verticalAlign: "top", minHeight: "1.675em" }}>
						<button>0</button>
						<button onClick={onChangePriceType(priceType === "STAKE" ? "LIABILITY" : "STAKE")}>
							{priceType === "STAKE" ? "S" : "L"}
						</button>
						<button
							onClick={cancelAllOrdersOnSelection}>
							K
						</button>
					</td>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className={matchedBets.length > 0 ? "lay-body" : ""}>
								{matchedBets.map((bet, idx) => {
									return <MatchedBet bet={bet} index={idx} />
								})}
							</tbody>
						</table>
					</td>
				</tbody>
			</table>
		</div>
	);
});

const mapStateToProps = (state, props) => {
	return {
		priceType: state.market.priceType,
		market: state.market.currentMarket
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onChangePriceType: priceType => e => dispatch(changePriceType(priceType)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);
