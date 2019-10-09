import React, { useState, createRef } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import GridHeader from "./GridHeader";
import GridDetailCell from "./GridDetailCell";
import EmptyCell from "./EmptyCell";
import { DeconstructLadder } from "../../utils/ladder/DeconstructLadder";
import { DeconstructRunner } from "../../utils/DeconstructRunner";
import { formatCurrency } from "../../utils/NumberFormat";
import {
	calcBackProfit,
	calcLiability,
	colorForBack
} from "../../utils/PriceCalculator";
import SuspendedGrid from "./SuspendedGrid";
import GridOrderRow from "./GridOrderRow";

const Grid = props => {
	const [rowHovered, setRowHovered] = useState(null);
	const [activeOrder, setActiveOrder] = useState(null);
	const [ordersVisible, setOrdersVisible] = useState(0);
	const oneClickRef = createRef();

	const renderRow = (betOdds, bestOdds, key, backLay) => {
		if (!betOdds) return Array(4).fill(<EmptyCell />);

		const rows = [];

		for (var i = 0; i < betOdds.length; i++) {
			rows.push(createCell(betOdds[i][0], betOdds[i][1], key, backLay));
			if (i === 4) break;
		}
		while (rows.length < 5) {
			rows.push(<EmptyCell />);
		}

		return rows;
	};

	const createCell = (odds, matched, key, backLay) => {
		return (
			<td
				className="grid-cell"
				onMouseEnter={e => {
					setRowHovered(key);
					$(e.currentTarget).one("mouseleave", e => {
						setRowHovered(null);
					});
				}}
				onClick={() => {
					if (!props.oneClickOn) {
						props.onUpdateOrder({
							id: key,
							visible: true,
							backLay: backLay,
							price: odds
						});
						setOrdersVisible(ordersVisible + 1);
					}
				}}
			>
				<span>{odds}</span>
				<span>{matched}</span>
			</td>
		);
	};

	const renderTableData = () => {
		return Object.keys(props.ladder).map(key => {
			const { atb, atl, batb, batl, ltp, tv, bg } = DeconstructLadder(
				props.ladder[key]
			);
			console.log(props.market);
			const { name, number, logo, order } = DeconstructRunner(props.runners[key], props.market.eventType.id);

			const orderProps =
				order.stakeLiability === 0
					? {
						text: "STAKE",
						text2: "BACK",
						prices: props.stakeBtns
					}
					: {
						text: "LIABILITY",
						text2: "LAY",
						prices: props.layBtns
					};

			orderProps.text2 = order.backLay === 0 ? "BACK" : "LAY";
			orderProps.bg = order.backLay === 0 ? "#DBEFFF" : "#FEE9EE";

			return (
				<React.Fragment>
					<tr>
						<GridDetailCell
							sportId={props.market.eventType.id}
							runner={props.runners[key]}
							name={name}
							number={number}
							logo={logo}
							selectRunner={e => {
								props.onSelectRunner(props.runners[key]);
							}}
							ltp={ltp}
							tv={tv}
							PL={
								order.visible && rowHovered === key && activeOrder
									? {
										val: formatCurrency(
											props.localeCode,
											props.currencyCode,
											calcBackProfit(order.stake, order.price, order.backLay)
										),
										color: colorForBack(order.backLay)
									}
									: rowHovered && rowHovered !== key && activeOrder
										? {
											val: formatCurrency(
												props.localeCode,
												props.currencyCode,
												calcLiability(activeOrder.stake, activeOrder.backLay)
											),
											color: colorForBack(activeOrder.backLay ^ 1)
										}
										:

										{ val: "", color: "" }
							}
							bg={bg}
						/>
						{renderRow(atb, batb, key, 0).reverse()}
						{renderRow(atl, batl, key, 1)}
					</tr>

					<GridOrderRow
						name={props.runners[key].runnerName}
						runnerId={key}
						order={order}
						orderProps={orderProps}
						toggleStakeAndLiability={stakeLiability => { props.onToggleStakeAndLiability(stakeLiability) }}
						toggleBackAndLay={side => {
							props.onToggleBackAndLay(side);
							setActiveOrder(Object.assign(activeOrder, { backLay: side.backLay }));
						}}
						updateOrderValue={orderValue => {
							props.onUpdateOrderValue(orderValue);
							setActiveOrder(orderValue);
						}}
						updateOrderPrice={price => { props.onUpdateOrderPrice(price) }}
						updateOrderVisibility={visibility => {
							props.onUpdateOrderVisibility(visibility);
							setActiveOrder(null);
							setOrdersVisible(ordersVisible - 1);
						}}
					/>
				</React.Fragment>
			);
		});
	};

	const renderSuspended = () => {
		return (
			<SuspendedGrid
				ladder={props.ladder}
				runners={props.runners}
				selectRunner={runner => {
					props.onSelectRunner(runner);
				}}

			/>
		);
	};
	return (
		<div id="grid-container">
			<table
				style={props.marketStatus === "SUSPENDED" ? { opacity: 0.75 } : {}}
				className={"grid-view"}
			>
				<p
					style={props.marketStatus !== "SUSPENDED" ? { display: "none" } : {}}
					id="suspended-message"
				>
					{props.marketStatus}
				</p>
				<tbody>
					<GridHeader
						market={props.market}
						ladder={props.ladder}
						marketOpen={props.marketOpen}
						status={props.marketStatus}
						country={{
							localeCode: props.localeCode,
							countryCode: props.countryCode
						}}
						oneClickRef={oneClickRef}
						oneClickOn={props.oneClickOn}
						toggleOneClick={e => {
							props.onToggleOneClick(!props.oneClickOn);
							const node = oneClickRef.current;
							props.oneClickOn ? node.blur() : node.focus();
						}}
					/>
					{props.marketOpen
						? props.marketStatus === "SUSPENDED"
							? renderSuspended()
							: props.marketStatus === "OPEN" || props.marketStatus === "RUNNING"
								? renderTableData()
								: null
						: null}
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		oneClickOn: state.market.oneClickOn,
		currentEvent: state.sports.currentSport.currentEvent,
		marketOpen: state.market.marketOpen,
		marketStatus: state.market.status,
		market: state.market.currentMarket,
		selection: state.market.runnerSelection,
		ladder: state.market.ladder,
		runners: state.market.runners,
		stakeBtns: state.settings.stakeBtns,
		layBtns: state.settings.layBtns,
		countryCode: state.account.countryCode,
		currencyCode: state.account.currencyCode,
		localeCode: state.account.localeCode,
		graph: state.graph
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onSelectRunner: runner => dispatch(actions.setRunner(runner)),
		onUpdateRunners: runners => dispatch(actions.loadRunners(runners)),
		onUpdateOrder: order => dispatch(actions.updateOrder(order)),
		onUpdateOrderValue: val => dispatch(actions.updateOrderValue(val)),
		onUpdateOrderPrice: price => dispatch(actions.updateOrderPrice(price)),
		onUpdateOrderVisibility: settings =>
			dispatch(actions.toggleVisibility(settings)),
		onToggleStakeAndLiability: value =>
			dispatch(actions.toggleStakeAndLiability(value)),
		onToggleBackAndLay: value => dispatch(actions.toggleBackAndLay(value)),
		onToggleOneClick: active => dispatch(actions.toggleOneClick(active))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Grid);
