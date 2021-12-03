import React, { createRef, useState } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import clsx from 'clsx';
//* Actions
import { setRunner, updateOrder, updateOrderValue, updateOrderPrice, toggleVisibility, toggleStakeAndLiability, toggleBackAndLay } from '../../redux/actions/market';
import { toggleOneClick } from '../../redux/actions/grid';
//* Utils
import { calcBackProfit, colorForBack } from '../../utils/Bets/BettingCalculations';
import { getMarketCashout } from '../../utils/Bets/GetMarketCashout';
import { getPLForRunner, marketHasBets } from '../../utils/Bets/GetProfitAndLoss';
import { isValidPrice, getNextPrice } from '../../utils/Bets/PriceCalculations';
import { DeconstructLadder } from '../../utils/ladder/DeconstructLadder';
import { DeconstructRunner } from '../../utils/Market/DeconstructRunner';
import { formatCurrency } from '../../utils/NumberFormat';
import { calculateHedgePL } from '../../utils/TradingStategy/HedingCalculator';
import { getOppositeSide } from '../../utils/Bets/GetOppositeSide';
// Grid Components
import GridDetailCell from './GridDetailCell';
import GridHeader from './GridHeader';
import GridOrderRow from './GridOrderRow';
import NonRunners from './NonRunner';
import SuspendedWarning from './SuspendedWarning';
//* JSS
import useStyles from '../../jss/components/GridView/GridView';

const Grid = ({
  oneClickOn,
  marketOpen,
  marketStatus,
  ladder,
  marketId,
  eventType,
  sortedLadder,
  runners,
  nonRunners,
  stakeBtns,
  layBtns,
  currencyCode,
  localeCode,
  bets,
  setRunner,
  updateOrder,
  updateOrderValue,
  updateOrderPrice,
  toggleVisibility,
  toggleStakeAndLiability,
  toggleBackAndLay,
  toggleOneClick,
}) => {
  const classes = useStyles();
  const [rowHovered, setRowHovered] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [ordersVisible, setOrdersVisible] = useState(0);
  const oneClickRef = createRef();

  const handlePriceClick = (key, side, odds) => (e) => {
    e.preventDefault();

    if (!marketOpen || marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') return;

    if (!oneClickOn) {
      updateOrder({
        id: key,
        visible: true,
        side,
        price: odds,
      });
      setOrdersVisible(ordersVisible + 1);
    }
  };

  const handlePriceHover = (key) => (e) => {
    if (!marketOpen || marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') return;
    setRowHovered(key);
    $(e.currentTarget).one('mouseleave', () => {
      setRowHovered(null);
    });
  };

  const changeSide = (id, side) => () => {
    if (!marketOpen || marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') return;
    toggleBackAndLay(id);
    setActiveOrder(Object.assign(activeOrder || {}, { side: getOppositeSide(side) }));
  };

  const handleOneClickPress = () => () => {
    if (!marketOpen || marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') return;
    toggleOneClick(!oneClickOn);

    const node = oneClickRef.current;
    if (oneClickOn) node.blur();
    else node.focus();
  };

  const toggleStakeAndLiabilityButtons = (data) => () => {
    if (!marketOpen || marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') return;
    toggleStakeAndLiability(data);
  };

  const toggleOrderRowVisibility = (data) => () => {
    toggleVisibility(data);
    setActiveOrder(null);
    setOrdersVisible(ordersVisible - 1);
  };

  const updateOrderSize = (data) => (e) => {
    // Size comes from the textfield input from event if not sent from the button
    if (!data.stake) {
      data.stake = e.target.value;
    }

    updateOrderValue(data);
    setActiveOrder(data);
  };

  const handlePriceChange = (data) => (e) => {
    const val = e.target.value;

    if (isValidPrice(val)) {
      data.price = getNextPrice(data.price, e.target.value);
      updateOrderPrice(data);
    }
  };

  const selectRunner = (runner) => () => {
    setRunner(runner);
  };

  const renderRow = (betOdds, key, side) => {
    //* Fill all empty cells if no data found
    if (!betOdds) {
      return new Array(5).fill(<td className={classes.gridCell} />);
    }

    const rows = [];

    for (let i = 0; i < betOdds.length; i += 1) {
      rows.push(createCell(betOdds[i][0], betOdds[i][1], key, side));
      if (i === 4) break;
    }

    //* Fill the remaining columns with empty cells
    while (rows.length < 5) {
      rows.push(<td key={rows.length + 1} className={classes.gridCell} />);
    }

    return rows;
  };

  const createCell = (odds, matched, key, side) => (
    <td key={`grid-${odds}`} className={classes.gridCell} onMouseEnter={handlePriceHover(key)} onClick={handlePriceClick(key, side, odds)} onContextMenu={handlePriceClick(key, (getOppositeSide(side)), odds)}>
      <span>{odds}</span>
      <span>{matched}</span>
    </td>
  );

  const renderProfitAndLossAndHedge = (order, color) => ({
    val: formatCurrency(localeCode, currencyCode, calcBackProfit(order.stake, order.price, order.side)),
    color,
  });

  const renderRunners = () =>
    sortedLadder.map((key) => {
      const { atb, atl, ltp, tv, ltpStyle } = DeconstructLadder(ladder[key]);
      const { name, number, logo, order } = DeconstructRunner(runners[key], eventType.id);
      const { side, stakeLiability } = order;

      return (
        <React.Fragment key={`grid-runner-${key}`}>
          <tr>
            <GridDetailCell
              sportId={eventType.id}
              marketId={marketId}
              runner={runners[key]}
              name={name}
              number={number}
              logo={logo}
              ltp={ltp}
              tv={tv}
              PL={
                marketHasBets(marketId, bets)
                  ? {
                      val: formatCurrency(localeCode, currencyCode, getPLForRunner(marketId, Number(key), bets.matched)),
                      color: colorForBack(order.side, getPLForRunner(marketId, Number(key), bets.matched)),
                    }
                  : order.visible && rowHovered === key && activeOrder
                  ? renderProfitAndLossAndHedge(order, colorForBack(order.side))
                  : rowHovered && rowHovered !== key && activeOrder
                  ? renderProfitAndLossAndHedge(order, colorForBack(activeOrder.side))
                  : { val: '', color: '' }
              }
              ltpStyle={ltpStyle}
            />
            {renderRow(atb, key, 'BACK').reverse()}
            {renderRow(atl, key, 'BACK')}
          </tr>

          <GridOrderRow
            selectionId={key}
            order={order}
            toggleStakeAndLiabilityButtons={toggleStakeAndLiabilityButtons}
            toggleBackAndLay={changeSide}
            stakeLiability={stakeLiability}
            updateOrderSize={updateOrderSize}
            updateOrderPrice={handlePriceChange}
            toggleOrderRowVisibility={toggleOrderRowVisibility}
            price={runners[key] ? runners[key].order.price : 0}
            side={side}
            size={activeOrder ? activeOrder.stake : 0}
          />
        </React.Fragment>
      );
    });

  const ltpSelectionIdObject = {};

  Object.keys(ladder).forEach((key) => {
    const { ltp } = DeconstructLadder(ladder[key]);
    ltpSelectionIdObject[key] = ltp[0];
  });

  const marketCashout = getMarketCashout(marketId, bets, ladder);

  return (
    <div
      className={clsx(classes.gridContainer, {
        [classes.suspendedMarket]: marketStatus === 'SUSPENDED',
      })}
    >
      <SuspendedWarning marketStatus={marketStatus} />
      <table style={marketStatus === 'SUSPENDED' ? { opacity: 0.3 } : {}} className={classes.gridView}>
        <tbody>
          <GridHeader
            marketOpen={marketOpen}
            ladder={ladder}
            country={{ localeCode, currencyCode }}
            oneClickRef={oneClickRef}
            oneClickOn={oneClickOn}
            toggleOneClick={handleOneClickPress}
            stakeBtns={stakeBtns}
            layBtns={layBtns}
            bets={bets}
            ltpList={ltpSelectionIdObject}
            marketCashout={marketCashout}
          />
          {marketOpen && (marketStatus === 'OPEN' || marketStatus === 'RUNNING' || marketStatus === 'SUSPENDED') ? (
            <>
              {renderRunners()}
              <NonRunners sportId={eventType.id} nonRunners={nonRunners} runners={runners} selectRunner={selectRunner} />
            </>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  oneClickOn: state.grid.oneClickOn,
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  marketId: state.market.marketId,
  ladder: state.market.ladder,
  sortedLadder: state.market.sortedLadder,
  runners: state.market.runners,
  nonRunners: state.market.nonRunners,
  eventType: state.market.eventType,
  stakeBtns: state.settings.stakeBtns,
  layBtns: state.settings.layBtns,
  currencyCode: state.account.currencyCode,
  localeCode: state.account.localeCode,
  bets: state.order.bets,
});

const mapDispatchToProps = {
  setRunner,
  updateOrder,
  updateOrderValue,
  updateOrderPrice,
  toggleVisibility,
  toggleStakeAndLiability,
  toggleBackAndLay,
  toggleOneClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
