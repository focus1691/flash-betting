import React, { useState } from 'react';
import { connect } from 'react-redux';
import useInterval from 'react-useinterval';
import { placeOrder, cancelBetFairOrder, removeOrder } from '../../actions/order';
import { updateLayList } from '../../actions/lay';
import { updateBackList } from '../../actions/back';
import { updateFillOrKillList } from '../../actions/fillOrKill';
import { updateTickOffsetList } from '../../actions/tickOffset';
import { setPastEventTime } from '../../actions/market';
import { checkBackAndLayOrders } from '../../utils/TradingStategy/BackLay';
import { countDownTime } from '../../utils/Market/CountDown';
import { msToHMS } from '../../utils/DateCalculator';

const ONE_SECOND = 1000;

const Countdown = ({
  market, marketOpen, marketStatus, inPlay, inPlayTime, pastEventTime, setPastEventTime, placeOrder,
  backList, layList, tickOffsetList, fillOrKillList, bets, updateBackList, updateLayList, updateTickOffsetList, updateFillOrKillList,
}) => {
  const [timeRemaining, setTimeRemaining] = useState('--');

  useInterval(async () => {
    setTimeRemaining(countDownTime(market, inPlay, inPlayTime, pastEventTime, setPastEventTime));

    //* BACK Before/After Market
    const newBackList = await checkBackAndLayOrders(backList, market.marketStartTime, placeOrder, market.marketId, 'BACK', bets.matched, bets.unmatched);
    if (Object.keys(backList).length > 0) {
      updateBackList(newBackList);
    }

    //* LAY Before/After Market
    const newLayList = await checkBackAndLayOrders(layList, market.marketStartTime, placeOrder, market.marketId, 'LAY', bets.matched, bets.unmatched);
    if (Object.keys(layList).length > 0) {
      updateLayList(newLayList);
    }

    //* FOK
    for (const betId in fillOrKillList) {
      if (fillOrKillList.hasOwnProperty(betId)) {
        const order = fillOrKillList[betId];
        if ((Date.now() / 1000) - (order.startTime / 1000) >= order.seconds) {
          const isCancelled = await cancelBetFairOrder(order);

          if (isCancelled) {
            await removeOrder(order);

            const newFillOrKillList = { ...fillOrKillList };
            delete newFillOrKillList[betId];
            updateFillOrKillList(newFillOrKillList);
          }

          // * TOS
          for (const tickOffsetId in tickOffsetList) {
            const tickOffsetRfs = tickOffsetList[tickOffsetId].rfs;
            if (tickOffsetRfs === order.rfs) {
              const isCancelled = await cancelBetFairOrder(order);

              if (isCancelled) {
                await removeOrder(adjustedTickOffsetList[tickOffsetRfs]);

                const adjustedTickOffsetList = { ...tickOffsetList };
                delete adjustedTickOffsetList[tickOffsetRfs];
                updateTickOffsetList(adjustedTickOffsetList);
              }
            }
          }
        }
      }
    }
  }, ONE_SECOND);

  const renderTime = () => {
    if (!marketOpen) return null;
    if (marketStatus === 'OPEN' || marketStatus === 'RUNNING') return msToHMS(timeRemaining);
    if (marketStatus === 'SUSPENDED' || marketStatus === 'CLOSED') return marketStatus;
    return null;
  };

  return (
    <div>{renderTime()}</div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  inPlay: state.market.inPlay,
  inPlayTime: state.market.inPlayTime,
  pastEventTime: state.market.pastEventTime,
  market: state.market.currentMarket,
  layList: state.lay.list,
  backList: state.back.list,
  fillOrKillList: state.fillOrKill.list,
  tickOffsetList: state.tickOffset.list,
  bets: state.order.bets,
});

const matchDispatchToProps = {
  placeOrder, updateBackList, updateLayList, updateFillOrKillList, updateTickOffsetList, setPastEventTime,
};

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);
