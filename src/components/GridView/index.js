import React, { useState, createRef } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import GridHeader from "./GridHeader";
import GridDetailCell from "./GridDetailCell";
import EmptyCell from "./EmptyCell";
import { DeconstructLadder } from "../../utils/ladder/DeconstructLadder";
import { formatCurrency } from "../../utils/NumberFormat";
import {
	calcBackProfit,
	calcLiability,
	colorForBack,
	colorForLay
} from "../../utils/PriceCalculator";
import Draggable from "react-draggable";
import DraggableGraph from "../DraggableGraph";
import SuspendedGrid from "./SuspendedGrid";
import GridOrderRow from "./GridOrderRow";

const Grid = props => {
	const [cellHovered, setCellHovered] = useState(false);
	const [stakeSelected, setStakeSelected] = useState(null);
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
					setCellHovered(true);

					$(e.currentTarget).one("mouseleave", e => {
						setCellHovered(false);
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
			const { atb, atl, batb, batl, ltp, tv } = DeconstructLadder(
				props.ladder[key]
			);
			const order = props.runners[key].order;

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
							runner={props.runners[key]}
							name={props.runners[key].runnerName}
							number={
								props.runners[key].metadata.CLOTH_NUMBER
									? props.runners[key].metadata.CLOTH_NUMBER + ". "
									: ""
							}
							logo={
								props.runners[key].metadata.COLOURS_FILENAME
									? `https://content-cache.cdnbf.net/feeds_images/Horses/SilkColours/${props.runners[key].metadata.COLOURS_FILENAME}`
									: `${window.location.origin}/images/baseball-player.png`
							}
							selectRunner={e => {
								props.onSelectRunner(props.runners[key]);
							}}
							ltp={ltp}
							tv={tv}
							PL={
								order.visible
									? {
										val: formatCurrency(
											props.localeCode,
											props.currencyCode,
											calcBackProfit(order.stake, order.price, order.backLay)
										),
										color: colorForBack(order.backLay)
									}
									: !order.visible && cellHovered
										? {
											val: formatCurrency(
												props.localeCode,
												props.currencyCode,
												calcLiability(stakeSelected, order.backLay)
											),
											color: colorForLay(order.backLay)
										}
										: { val: "", color: "" }
							}
							bg={
								ltp[0] < ltp[1] // #0AFD03 (Green Lower LTP)
									? "#0AFD03"
									: ltp[0] > ltp[1] // #FC0700 (Red Higher LTP)
										? "#FC0700"
										: ltp[0] === ltp[1] // #FFFF00 (Yellow Same LTP)
											? "#FFFF00"
											: "#FFF" // #FFF (No Value)
							}
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
						toggleBackAndLay={side => { props.onToggleBackAndLay(side) }}
						updateOrderValue={orderValue => {
							props.onUpdateOrderValue(orderValue);
							setStakeSelected(orderValue.stake);
						}}
						updateOrderPrice={price => { props.onUpdateOrderPrice(price) }}
						updateOrderVisibility={visibility => {
							props.onUpdateOrderVisibility(visibility);
							setStakeSelected(null);
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
			<Draggable bounds="body">
				<div
					className="box"
					style={{ position: "absolute", top: "25%", left: "50%" }}
				>
					<DraggableGraph />
				</div>
			</Draggable>
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
						? props.marketStatus === "OPEN"
							? renderTableData()
							: props.marketStatus === "SUSPENDED"
								? renderSuspended()
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
