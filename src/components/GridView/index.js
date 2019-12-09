import React, { useState, createRef } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import * as actions from "../../actions/market";
import { setStakeInOneClick } from "../../actions/settings";
import GridHeader from "./GridHeader";
import GridDetailCell from "./GridDetailCell";
import EmptyCell from "./EmptyCell";
import { getNextPrice } from "../../utils/ladder/CreateFullLadder";
import { DeconstructLadder } from "../../utils/ladder/DeconstructLadder";
import { DeconstructRunner } from "../../utils/Market/DeconstructRunner";
import { formatCurrency } from "../../utils/NumberFormat";
import { calcBackProfit, colorForBack } from "../../utils/Bets/BettingCalculations";
import { marketHasBets, getPLForRunner } from "../../utils/Bets/GetProfitAndLoss";
import NonRunners from "./NonRunner";
import SuspendedGrid from "./SuspendedGrid";
import GridOrderRow from "./GridOrderRow";
import { placeOrder } from "../../actions/order";
import { getMarketCashout } from "../../utils/Bets/GetMarketCashout";
import { calcHedgedPL2 } from "../../utils/TradingStategy/HedingCalculator";
import { isValidPrice } from "../../utils/Bets/Validator";
import SuspendedWarning from "./SuspendedWarning";
import { openLiveStream } from "../../actions/draggable";

const Grid = props => {

	const [rowHovered, setRowHovered] = useState(null);
	const [activeOrder, setActiveOrder] = useState(null);
	const [ordersVisible, setOrdersVisible] = useState(0);
	const oneClickRef = createRef();

	const renderData = () => {
		return (
			<>
			{props.marketOpen
				? props.marketStatus === "SUSPENDED"
					? renderSuspended()
					: props.marketStatus === "OPEN" || props.marketStatus === "RUNNING"
						? renderTableData()
						: null
				: null}
				</>
		);
	};

	const handlePriceClick = (key, backLay, odds) => e => {
		e.preventDefault();

		if (!props.oneClickOn) {
			props.onUpdateOrder({
				id: key,
				visible: true,
				backLay: backLay,
				price: odds
			});
			setOrdersVisible(ordersVisible + 1);
		}
	};

	const handlePriceHover = key => e => {
		setRowHovered(key);
		$(e.currentTarget).one("mouseleave", e => {
			setRowHovered(null);
		});
	}

	const toggleBackAndLay = (order) => e => {
		props.onToggleBackAndLay({ id: order.id });
		setActiveOrder(Object.assign(activeOrder || {}, { backLay: order.backLay }));
	};

	const toggleOneClick = () => e => {
		props.onToggleOneClick(!props.oneClickOn);
		const node = oneClickRef.current;
		props.oneClickOn ? node.blur() : node.focus();
	};

	const toggleStakeAndLiabilityButtons = data => e => {
		props.onToggleStakeAndLiability(data);
	};

	const toggleOrderRowVisibility = data => e => {
		props.onUpdateOrderVisibility(data);
		setActiveOrder(null);
		setOrdersVisible(ordersVisible - 1);
	};

	const setStakeInOneClick = stake => e => {
		props.setStakeInOneClick(stake);
	};

	const updateOrderSize = data => e => {
		// Size comes from the textfield input from event if not sent from the button
		if (!data.stake) {
			data.stake = e.target.value;
		}

		props.onUpdateOrderValue(data);
		setActiveOrder(data);
	};

	const updateOrderPrice = data => e => {
		let val = parseInt(e.target.value);

		if (isValidPrice(val)) {
			data.price = getNextPrice(data.price, e.target.value);
			props.onUpdateOrderPrice(data);
		}
	};

	const selectRunner = runner => e => {
		props.onSelectRunner(runner);
	};

	const renderRow = (betOdds, bestOdds, key, backLay) => {
		// Fill all empty cells if no data found
		if (!betOdds) return Array(5).fill(<EmptyCell />);

		const rows = [];

		for (var i = 0; i < betOdds.length; i++) {
			rows.push(createCell(betOdds[i][0], betOdds[i][1], key, backLay));
			if (i === 4) break;
		}

		// Fill the remaining columns with empty cells
		while (rows.length < 5) {
			rows.push(<EmptyCell />);
		}

		return rows;
	};

	const createCell = (odds, matched, key, backLay) => {
		return (
			<td
				className="grid-cell"
				onMouseEnter={handlePriceHover(key)}
				onClick={handlePriceClick(key, backLay, odds)}
				onContextMenu={handlePriceClick(key, backLay ^= 1, odds)}
			>
				<span>{odds}</span>
				<span>{matched}</span>
			</td>
		);
	};

	const renderProfitAndLossAndHedge = (order, color) => {
		return {
			val: formatCurrency(
				props.localeCode,
				props.currencyCode,
				calcBackProfit(order.stake, order.price, order.backLay)
			),
			color: color
		}
	};

	const renderTableData = () => {
		return (
			<React.Fragment>
				{renderRunners()}
				<NonRunners
					sportId={props.market.eventType.id}
					nonRunners={props.nonRunners}
					runners={props.runners}
					selectRunner={selectRunner}
				/>
			</React.Fragment>
		);
	};

	const renderRunners = () => {
		return props.ladder.map(ladder => {
			const { name, number, logo, order } = DeconstructRunner(props.runners[ladder.id], props.market.eventType.id);

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


			const profitArray = Object.values(props.bets.matched).filter(bet => bet.selectionId == props.runners[ladder.id].selectionId).map(bet => (bet.side === "LAY" ? -1 : 1) * calcHedgedPL2(parseFloat(bet.size), parseFloat(bet.price), parseFloat(ladder.ltp[0])));
			const profit = (-1 * profitArray.reduce((a, b) => a - b, 0)).toFixed(2);

			return (
				<React.Fragment>
					<tr>
						<GridDetailCell
							sportId={props.market.eventType.id}
							market={props.market}
							runner={props.runners[ladder.id]}
							name={name}
							number={number}
							logo={logo}
							ltp={ladder.ltp}
							tv={ladder.tv}
							bets={props.bets}
							PL={
								marketHasBets(props.market.marketId, props.bets) ?
									{
										val: formatCurrency(
											props.localeCode,
											props.currencyCode,
											getPLForRunner(props.market.marketId, parseInt(ladder.id), props.bets)
										),
										color: colorForBack(order.backLay, getPLForRunner(props.market.marketId, parseInt(ladder.id), props.bets))
									}
									:
									order.visible && rowHovered === ladder.id && activeOrder
										? renderProfitAndLossAndHedge(order, colorForBack(order.backLay))
										: rowHovered && rowHovered !== ladder.id && activeOrder
											?
											renderProfitAndLossAndHedge(order, colorForBack(activeOrder.backLay ^ 1))
											:
											{ val: "", color: "" }
							}
							hedge={profit}
							ltpStyle={ladder.ltpStyle}
						/>
						{renderRow(ladder.atb, ladder.batb, ladder.id, 0).reverse()}
						{renderRow(ladder.atl, ladder.batl, ladder.id, 1)}
					</tr>

					<GridOrderRow
						runnerId={ladder.id}
						order={order}
						orderProps={orderProps}
						toggleStakeAndLiabilityButtons={toggleStakeAndLiabilityButtons}
						toggleBackAndLay={toggleBackAndLay}
						updateOrderSize={updateOrderSize}
						updateOrderPrice={updateOrderPrice}
						toggleOrderRowVisibility={toggleOrderRowVisibility}
						onPlaceOrder={props.onPlaceOrder}
						market={props.market}
						bets={props.bets}
						price={props.market.runners[ladder.id] ? props.market.runners[ladder.id].order.price : 0}
						side={activeOrder && activeOrder.side == 0 ? "BACK" : "LAY"}
						size={activeOrder ? activeOrder.stake : 0}
					/>
				</React.Fragment>
			);
		});
	};

	const renderSuspended = () => {
		return (
			<SuspendedGrid
				ladder={props.sortedLadder}
				runners={props.runners}
				selectRunner={selectRunner}
				eventId={props.market.eventType.id}
			/>
		);
	};


	const ltpSelectionIdObject = {};
	props.ladder.forEach(ladder => { ltpSelectionIdObject[ladder.id] = ladder.ltp[0] });

	const marketCashout = getMarketCashout(props.market.marketId, props.bets, props.ladder);

	return (
		<div id="grid-container">
			<table
				style={props.marketStatus === "SUSPENDED" ? { opacity: 0.75 } : {}}
				className={"grid-view"}
			>
				<SuspendedWarning marketStatus={props.marketStatus} />
				<tbody>
					<GridHeader
						market={props.market}
						ladder={props.ladder}
						marketOpen={props.marketOpen}
						inPlay={props.inPlay}
						status={props.marketStatus}
						country={{
							localeCode: props.localeCode,
							countryCode: props.countryCode
						}}
						oneClickRef={oneClickRef}
						oneClickOn={props.oneClickOn}
						toggleOneClick={toggleOneClick}
						oneClickStake={props.oneClickStake}
						setStakeOneClick={setStakeInOneClick}
						stakeBtns={props.stakeBtns}
						layBtns={props.layBtns}
						bets={props.bets}
						ltpList={ltpSelectionIdObject}
						onPlaceOrder={props.onPlaceOrder}
						marketCashout={marketCashout}
						openLiveStream={props.onOpenLiveStream}
					/>
					{renderData()}
				</tbody>
			</table>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		oneClickOn: state.market.oneClickOn,
		oneClickStake: state.settings.stake,
		currentEvent: state.sports.currentSport.currentEvent,
		marketOpen: state.market.marketOpen,
		marketStatus: state.market.status,
		inPlay: state.market.inPlay,
		market: state.market.currentMarket,
		selection: state.market.runnerSelection,
		ladder: state.market.ladder,
		sortedLadder: state.market.sortedLadder,
		runners: state.market.runners,
		nonRunners: state.market.nonRunners,
		stakeBtns: state.settings.stakeBtns,
		layBtns: state.settings.layBtns,
		countryCode: state.account.countryCode,
		currencyCode: state.account.currencyCode,
		localeCode: state.account.localeCode,
		graph: state.graph,
		bets: state.order.bets,
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
		onToggleOneClick: active => dispatch(actions.toggleOneClick(active)),
		setStakeInOneClick: stake => dispatch(setStakeInOneClick(stake)),
		onPlaceOrder: order => dispatch(placeOrder(order)),
		onOpenLiveStream: () => e => dispatch(openLiveStream())
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Grid);
