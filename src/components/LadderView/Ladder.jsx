import crypto from 'crypto';
import React, {
  memo, useMemo, useCallback, useEffect, useRef, useState,
} from 'react';
import { connect } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { updateBackList } from '../../actions/back';
import { updateLayList } from '../../actions/lay';
import { updateStopLossList } from '../../actions/stopLoss';
import { updateTickOffsetList } from '../../actions/tickOffset';
import { updateStopEntryList } from '../../actions/stopEntry';
import { updateFillOrKillList } from '../../actions/fillOrKill';
import {
  cancelOrders, placeOrder, updateOrders, placeStopLoss, replaceStopLoss, placeTickOffset, placeFillOrKill,
} from '../../actions/order';
import { getLTP } from '../../selectors/marketSelector';
import { getMatchedBets, getUnmatchedBets, getSelectionMatchedBets } from '../../selectors/orderSelector';
import { combineUnmatchedOrders } from '../../utils/Bets/CombineUnmatchedOrders';
import { getStakeVal } from '../../selectors/settingsSelector';
import { ALL_PRICES, formatPrice } from '../../utils/ladder/CreateFullLadder';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { findTickOffset } from '../../utils/TradingStategy/TickOffset';
import { findStop } from '../../utils/TradingStategy/StopLoss';
import Container from './Container';
import Header from './Header';
import LadderRow from './Rows/LadderRow';
import OrderRow from './Rows/OrderRow/OrderRow';
import PercentageRow from './Rows/PercentageRow/PercentageRow';
import PriceRow from './Rows/PriceRow';

const isMoving = (prevProps, nextProps) => nextProps.draggingLadder === nextProps.selectionId && prevProps.order === nextProps.order;

const Ladder = memo(({
  selectionId, ltp, placeOrder, updateOrders, order, selectionMatchedBets, unmatchedBets, matchedBets, setLadderSideLeft, updateStopLossList, backList, updateBackList, layList, updateLayList, stopLossHedged, tickOffsetList, tickOffsetSelected, tickOffsetTicks,
  tickOffsetUnits, tickOffsetTrigger, tickOffsetHedged, fillOrKillSelected, fillOrKillSeconds, fillOrKillList, updateFillOrKillList, stopEntryList, updateStopEntryList, updateTickOffsetList, stopLossOffset, stopLossList, stopLossUnits, stakeVal, draggingLadder, customStakeActive, customStake,
}) => {
  const containerRef = useRef(null);
  const listRef = useRef();
  const [listRefSet, setlistRefSet] = useState(false);
  const [isReferenceSet, setIsReferenceSet] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isLadderDown, setLadderDown] = useState(false);
  const [ladderLocked, setLadderLocked] = useState(false);
  const [ladderLastHovered, setLadderLastHovered] = useState(Date.now());

  const ladderStyle = useMemo(() => (listRefSet ? { paddingRight: `${listRef.current.offsetWidth - listRef.current.clientWidth - 17}px` } : ''), [listRefSet]);
  const ltpHedge = useMemo(() => CalculateLadderHedge(ltp, selectionMatchedBets, 'hedged'), [ltp, selectionMatchedBets]);
  const hedgingAvailable = useMemo(() => ltpHedge.size >= 0.01, [ltpHedge]);

  const setReferenceSent = () => {
    setIsReferenceSet(true);
  };

  const onHoverLadder = useCallback(() => {
    if (!ladderLocked) {
      setLadderLocked(true);
      setLadderLastHovered(Date.now());
    }
  }, [ladderLocked]);

  const overLeaveLadder = useCallback(() => {
    if (ladderLocked && Date.now() - ladderLastHovered > 100) {
      setLadderLocked(false);
    }
  }, [ladderLastHovered, ladderLocked]);

  const scrollToLTP = useCallback(() => {
    const ltpIndex = ALL_PRICES.findIndex((item) => parseFloat(item) === parseFloat(ltp[0]));
    if (listRef.current !== null && listRef.current !== undefined && ltpIndex !== -1) {
      // we do the calculation because we start in reverse
      listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, 'center');
      setlistRefSet(true);
    }
  }, [ltp]);

  //* Scroll to the LTP when the ladder first loads
  useEffect(() => {
    setTimeout(() => {
      scrollToLTP();
    }, 1000);
  }, []);

  //* Scroll to the LTP when the ladder order changes
  useEffect(() => {
    if (!ladderLocked) scrollToLTP();
  }, [ltp, draggingLadder, scrollToLTP, ladderLocked]);

  const replaceStopLossOrder = useCallback(async ({ price, stopLoss }) => {
    const newSL = await replaceStopLoss(stopLoss, stopLossList, {
      selectionId,
      stakeVal,
      price: formatPrice(price),
      units: stopLossUnits,
      stopLossHedged,
    });
    updateStopLossList(newSL);
  }, [selectionId, updateStopLossList, stakeVal, stopLossHedged, stopLossList, stopLossUnits]);

  const handleHedgeCellClick = useCallback(async (marketId, selectionId, unmatchedBetsOnRow, side, price, hedge) => {
    if (unmatchedBetsOnRow) {
      const {
        back, lay, stopLoss, tickOffset, stopEntry, fillOrKill,
      } = await cancelOrders(unmatchedBetsOnRow, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side);
      updateBackList(back);
      updateLayList(lay);
      updateStopLossList(stopLoss);
      updateTickOffsetList(tickOffset);
      updateStopEntryList(stopEntry);
      updateFillOrKillList(fillOrKill);
    } else if (hedge && hedge.size > 0) {
      const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
      const result = await placeOrder({
        marketId,
        side,
        size: hedge.size,
        price,
        selectionId,
        customerStrategyRef,
        unmatchedBets,
        matchedBets,
      });
      if (result.bets) updateOrders(result.bets);
    }
  }, [backList, fillOrKillList, layList, matchedBets, updateBackList, updateFillOrKillList, updateLayList, updateStopEntryList, updateStopLossList, updateTickOffsetList, placeOrder, updateOrders, stopEntryList, stopLossList, tickOffsetList, unmatchedBets]);

  const handlePlaceOrder = useCallback(async (side, price, marketId, selectionId, stakeVal, stopLossSelected, stopLossData,
    stopLossUnits, hedgeSize) => {
    const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
    const betSize = (customStakeActive && customStake) ? customStake : stakeVal[selectionId];
    //* Place the order first with BetFair and then execute the tools
    // //! Tool priority: 1) Stop Loss 2) Tick Offset 3) Fill or Kill
    // const result = await placeOrder({
    const betId = await placeOrder({
      side,
      price: formatPrice(price),
      marketId,
      selectionId,
      customerStrategyRef,
      // unmatchedBets,
      // matchedBets,
      size: betSize,
      // orderCompleteCallBack: async (betId) => {
      // },
    });
    //* betId only returned if the bet was success
    if (betId) {
      if (stopLossSelected && !stopLossData) {
        const SL = await placeStopLoss({
          marketId,
          selectionId: parseInt(selectionId),
          side: side === 'BACK' ? 'LAY' : 'BACK',
          price: findStop(price, stopLossOffset, side),
          custom: false,
          units: stopLossUnits,
          ticks: stopLossOffset,
          rfs: customerStrategyRef,
          assignedIsOrderMatched: false,
          size: betSize,
          betId,
          hedged: stopLossHedged,
          strategy: 'Stop Loss',
        }, stopLossList);
        updateStopLossList(SL);
      } else if (tickOffsetSelected) {
        const tos = await placeTickOffset({
          strategy: 'Tick Offset',
          marketId,
          selectionId,
          price: findTickOffset(
            formatPrice(price),
            side.toLowerCase() === 'lay' ? 'back' : 'lay',
            tickOffsetTicks,
            tickOffsetUnits === 'Percent',
          ).priceReached,
          size: tickOffsetHedged ? hedgeSize : betSize,
          side: side === 'BACK' ? 'LAY' : 'BACK',
          percentageTrigger: tickOffsetTrigger,
          rfs: customerStrategyRef,
          betId,
          hedged: tickOffsetHedged,
          minFillSize: fillOrKillSelected ? (tickOffsetHedged ? hedgeSize : stakeVal[selectionId]) : 1,
        }, tickOffsetList);
        updateTickOffsetList(tos);
      }
  
      if (!stopLossSelected && fillOrKillSelected) {
        const FOK = await placeFillOrKill({
          strategy: 'Fill Or Kill',
          marketId,
          selectionId,
          seconds: fillOrKillSeconds,
          startTime: Date.now(),
          betId,
          rfs: customerStrategyRef,
        }, fillOrKillList);
        updateFillOrKillList(FOK);
      }
    }
    // if (result && result.bets) updateOrders(result.bets);
  }, [customStakeActive, customStake, placeOrder, tickOffsetSelected, fillOrKillSelected, stopLossOffset, stopLossHedged, stopLossList, updateStopLossList, tickOffsetTicks, tickOffsetUnits, tickOffsetHedged, tickOffsetTrigger, tickOffsetList, updateTickOffsetList, fillOrKillSeconds, fillOrKillList, updateFillOrKillList]);

  const cancelSpecialOrders = useCallback(async (order, side) => {
    const betsToPass = order || combineUnmatchedOrders(backList, layList, stopEntryList, tickOffsetList, stopLossList, unmatchedBets)[selectionId];

    if (betsToPass) {
      const {
        back, lay, stopLoss, tickOffset, stopEntry, fillOrKill,
      } = await cancelOrders(betsToPass, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, side);

      updateBackList(back);
      updateLayList(lay);
      updateStopLossList(stopLoss);
      updateTickOffsetList(tickOffset);
      updateStopEntryList(stopEntry);
      updateFillOrKillList(fillOrKill);
    }
  }, [backList, layList, stopEntryList, tickOffsetList, stopLossList, unmatchedBets, selectionId, fillOrKillList, updateBackList, updateLayList, updateStopLossList, updateTickOffsetList, updateStopEntryList, updateFillOrKillList]);

  return (
    <Container
      isReferenceSet={isReferenceSet}
      order={order}
      containerRef={containerRef}
      isMoving={isMoving}
      isLadderDown={isLadderDown}
      setIsReferenceSet={setReferenceSent}
      setIsMoving={setIsMoving}
      setLadderDown={setLadderDown}
    >
      <Header selectionId={selectionId} setLadderDown={setLadderDown} hedge={ltpHedge} />

      <div className="ladder" onContextMenu={() => false} onPointerOver={onHoverLadder} onPointerLeave={overLeaveLadder}>
        <PercentageRow
          setLadderSideLeft={setLadderSideLeft}
          selectionId={selectionId}
          cancelSpecialOrders={cancelSpecialOrders}
        />
        <AutoSizer>
          {({ height, width }) => (
            <List
              className="List"
              height={height}
              itemCount={ALL_PRICES.length}
              itemSize={20}
              width={width}
              ref={listRef}
              style={ladderStyle}
              itemData={{
                selectionId,
                handlePlaceOrder,
                cancelSpecialOrders,
                handleHedgeCellClick,
                replaceStopLossOrder,
                isMoving,
                hedgingAvailable,
              }}
            >
              {LadderRow}
            </List>
          )}
        </AutoSizer>
      </div>
      <PriceRow selectionId={selectionId} />
      <OrderRow
        selectionId={selectionId}
        cancelSpecialOrders={cancelSpecialOrders}
      />
    </Container>
  );
}, isMoving);

const mapStateToProps = (state, { selectionId }) => ({
  ltp: getLTP(state.market.ladder, { selectionId }),
  selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  unmatchedBets: getUnmatchedBets(state.order.bets),
  matchedBets: getMatchedBets(state.order.bets),
  stakeVal: getStakeVal(state.settings.stake, { selectionId }),
  customStake: state.market.runners[selectionId].order.customStake,
  customStakeActive: state.market.runners[selectionId].order.customStakeActive,
  draggingLadder: state.market.draggingLadder,

  //* Back/Lay
  layList: state.lay.list,
  backList: state.back.list,

  //* SL
  stopLossList: state.stopLoss.list,
  stopLossOffset: state.stopLoss.offset,
  stopLossSelected: state.stopLoss.selected,
  stopLossUnits: state.stopLoss.units,
  stopLossHedged: state.stopLoss.hedged,

  //* TO
  tickOffsetList: state.tickOffset.list,
  tickOffsetSelected: state.tickOffset.selected,
  tickOffsetTicks: state.tickOffset.ticks,
  tickOffsetUnits: state.tickOffset.units,
  tickOffsetTrigger: state.tickOffset.percentTrigger,
  tickOffsetHedged: state.tickOffset.hedged,

  //* FOK
  fillOrKillSelected: state.fillOrKill.selected,
  fillOrKillSeconds: state.fillOrKill.seconds,
  fillOrKillList: state.fillOrKill.list,

  //* SE
  stopEntryList: state.stopEntry.list,
});

const mapDispatchToProps = {
  placeOrder, updateOrders, updateBackList, updateLayList, updateStopLossList, updateTickOffsetList, updateFillOrKillList, updateStopEntryList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);
