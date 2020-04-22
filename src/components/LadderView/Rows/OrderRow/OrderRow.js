import React, { memo, useCallback } from "react";
import { connect } from "react-redux";
import { changePriceType } from "../../../../actions/market";
import { MatchedBet } from "./MatchedBet";
import { UnmatchedBet } from "./UnmatchedBet";
import { getSelectionMatchedBets, getSelectionUnmatchedBets } from "../../../../selectors/orderSelector";

const OrderRow = memo(({ selectionId, matchedBets, unmatchedBets, backList, layList, slList, tosList, fokList, seList, cancelSpecialOrders, priceType, changePriceType }) => {
	const cancelUnmatchedOrder = useCallback(
		(order) => {
			cancelSpecialOrders(order);
		},
		[cancelSpecialOrders]
	);

	const cancelAllOrdersOnSelection = useCallback(() => {
		cancelSpecialOrders();
	}, [cancelSpecialOrders]);

	const handleButtonClick = useCallback(() => {
		changePriceType(priceType === "STAKE" ? "LIABILITY" : "STAKE");
	}, [priceType, changePriceType]);

	const renderSpecialBets = useCallback(
		(bets) => {
			const list = [];
			for (var id in bets) {
				if (Array.isArray(bets[id])) {
					for (var i = 0; i < bets[id].length; i++) {
						if (selectionId == bets[id][i].selectionId) {
							list.push(<UnmatchedBet key={`ladder-matched-bet-${bets[id][i].selectionId}-${bets[id][i].rfs}-${i}`} bet={bets[id][i]} cancelBet={cancelUnmatchedOrder} />);
						}
					}
				} else {
					if (selectionId == bets[id].selectionId) {
						list.push(<UnmatchedBet key={`ladder-matched-bet-${bets[id].selectionId}-${bets[id].rfs}-${i}`} bet={bets[id]} cancelBet={cancelUnmatchedOrder} />);
					}
				}
			}
			return list;
		},
		[selectionId, cancelUnmatchedOrder]
	);

	const renderUnmatchedBets = useCallback(() => {
		const list = [];
		for (var i = 0; i < unmatchedBets.length; i++) {
			list.push(<UnmatchedBet key={`ladder-matched-bet-${unmatchedBets[i].selectionId}-${unmatchedBets[i].rfs}-${i}`} bet={unmatchedBets[i]} cancelBet={cancelUnmatchedOrder} />);
		}
		return list;
	}, [cancelUnmatchedOrder, unmatchedBets.length]);

	const renderMatchedBets = useCallback(() => {
		const list = [];
		for (var i = 0; i < matchedBets.length; i++) {
			list.push(<MatchedBet key={`ladder-matched-bet-${matchedBets[i].selectionId}-${i}`} bet={matchedBets[i]} index={i} />);
		}
		return list;
	}, [matchedBets.length]);

	return (
		<div className={"order-row"}>
			<table>
				<tbody>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className="lay-body">
								{renderUnmatchedBets()}
								{renderSpecialBets(backList)}
								{renderSpecialBets(layList)}
								{renderSpecialBets(slList)}
								{renderSpecialBets(tosList)}
								{renderSpecialBets(fokList)}
								{renderSpecialBets(seList)}
							</tbody>
						</table>
					</td>
					<td colSpan={1} rowSpan={4} style={{ verticalAlign: "top", minHeight: "1.675em" }}>
						<button>0</button>
						<button onClick={handleButtonClick}>{priceType === "STAKE" ? "S" : "L"}</button>
						<button onClick={cancelAllOrdersOnSelection}>K</button>
					</td>
					<td colSpan={3} rowSpan={4} style={{ verticalAlign: "top" }}>
						<table className="lay-table">
							<tbody className="lay-body">{renderMatchedBets()}</tbody>
						</table>
					</td>
				</tbody>
			</table>
		</div>
	);
});

const mapStateToProps = (state, { selectionId }) => {
	return {
		priceType: state.market.priceType,
		matchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
		unmatchedBets: getSelectionUnmatchedBets(state.order.bets, { selectionId }),
		backList: state.back.list,
		layList: state.lay.list,
		slList: state.stopLoss.list,
		tosList: state.tickOffset.list,
		fokList: state.fillOrKill.list,
		seList: state.stopEntry.list,
	};
};

const mapDispatchToProps = { changePriceType };

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);