import React, { memo, useCallback } from "react";
import { connect } from "react-redux";
import { changePriceType } from "../../../../actions/market";
import { MatchedBet } from "./MatchedBet";
import { UnmatchedBet } from "./UnmatchedBet";
import { getMatchedBets, getUnmatchedBets } from "../../../../selectors/orderSelector";

const OrderRow = memo(({selectionId, matchedBets, unmatchedBets, backList, layList, slList, tosList, fokList, seList, cancelSpecialOrders, priceType, changePriceType}) => {

	const cancelUnmatchedOrder = useCallback(order => {
		cancelSpecialOrders(order);
	}, [cancelSpecialOrders]);

	const cancelAllOrdersOnSelection = useCallback(() => {
		cancelSpecialOrders();
	}, [cancelSpecialOrders]);

	const handleButtonClick = useCallback(() => {
		changePriceType(priceType === "STAKE" ? "LIABILITY" : "STAKE");
	}, [priceType, changePriceType]);

	const createUnmatchedBetRow = (bet, index) => {
		return (
			<UnmatchedBet
				key={`ladder-matched-bet-${bet.selectionId}-${bet.rfs}-${index}`}
				bet={bet}
				cancelBet={cancelUnmatchedOrder} />
		);
	};

	const renderUnmatchedBets = useCallback(bets => {
		const list = [];
		for (var id in bets) {
			if (Array.isArray(bets[id])) {
				for (var i = 0; i < bets[id].length; i++) {
					if (selectionId == bets[id][i].selectionId) list.push(createUnmatchedBetRow(bets[id][i], i));
				}
			} else {
				if (selectionId == bets[id].selectionId) list.push(createUnmatchedBetRow(bets[id], id));
			}
		}
		return list;
	}, [selectionId, unmatchedBets, backList, layList, slList, tosList, fokList, seList]);

	const renderMatchedBets = useCallback(() => {
		const list = [];
		for (var id in matchedBets) {
			if (selectionId == matchedBets[id].selectionId) {
				list.push(<MatchedBet
					key={`ladder-matched-bet-${matchedBets[id].selectionId}-${id}`}
					bet={matchedBets[id]} index={id} />)

			}
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
								{renderUnmatchedBets(unmatchedBets)}
								{renderUnmatchedBets(backList)}
								{renderUnmatchedBets(layList)}
								{renderUnmatchedBets(slList)}
								{renderUnmatchedBets(tosList)}
								{renderUnmatchedBets(fokList)}
								{renderUnmatchedBets(seList)}
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
							<tbody className="lay-body">
								{renderMatchedBets()}
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
		priceType: state.market.priceType,
		matchedBets: getMatchedBets(state.order.bets),
		unmatchedBets: getUnmatchedBets(state.order.bets),
		backList: state.back.list,
		layList: state.lay.list,
		slList: state.stopLoss.list,
		tosList: state.tickOffset.list,
		fokList: state.fillOrKill.list,
		seList: state.stopEntry.list
	};
};

const mapDispatchToProps = { changePriceType };

export default connect(mapStateToProps, mapDispatchToProps)(OrderRow);