import React, { useState } from "react";
import { connect } from "react-redux";
import useInterval from "react-useinterval";
import { placeOrder, cancelOrder, updateOrders } from "../../actions/order";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { setPastEventTime } from "../../actions/market";
import { checkBackAndLayOrders } from '../../utils/TradingStategy/BackLay';
import { countDownTime } from "../../utils/Market/CountDown";
import { msToHMS } from "../../utils/DateCalculator";

const ONE_SECOND = 1000;

const Countdown = ({market, marketOpen, marketStatus, inPlay, inPlayTime, pastEventTime, onPastEventTime, onPlaceOrder, onCancelOrder, onChangeOrders,
                    backList, layList, tickOffsetList, fillOrKillList,  bets, onUpdateBackList, onUpdateLayList, onUpdateTickOffsetList, onUpdateFillOrKillList}) => {

  const [timeRemaining, setTimeRemaining] = useState("--");

  useInterval(async () => {
    setTimeRemaining(countDownTime(market, inPlay, inPlayTime, pastEventTime, onPastEventTime));
    
    // Back Before/After Market
    const newBackList = await checkBackAndLayOrders(backList, market.marketStartTime, onPlaceOrder, market.marketId, "BACK", bets.matched, bets.unmatched);
    if (Object.keys(backList).length > 0) {
      onUpdateBackList(newBackList);
    }

    // Lay Before/After Market
    const newLayList = await checkBackAndLayOrders(layList, market.marketStartTime, onPlaceOrder, market.marketId, "LAY", bets.matched, bets.unmatched);
    if (Object.keys(layList).length > 0) {
      onUpdateLayList(newLayList);
    }

    const newFillOrKillList = {};
    const adjustedTickOffsetList = Object.assign({}, tickOffsetList);
    const adjustedUnmatchedBets = Object.assign({}, bets.unmatched);
    let ordersToRemove = [];

    // Fill Or Kill
    Object.keys(fillOrKillList).map((betId, index) => {
      const order = fillOrKillList[betId];
      if ((Date.now() / 1000) - (order.startTime / 1000) >= order.seconds) {
        onCancelOrder({
          marketId: market.marketId,
          betId: betId,
          sizeReduction: null,
          matchedBets: bets.matched,
          unmatchedBets: bets.unmatched
        })

        ordersToRemove = ordersToRemove.concat(order);

        if (adjustedUnmatchedBets[betId] !== undefined) {
          ordersToRemove = ordersToRemove.concat(adjustedUnmatchedBets[betId]);
          delete adjustedUnmatchedBets[betId];
        }

        // Tick Offset
        Object.values(tickOffsetList).map(tickOffsetOrder => {
          if (tickOffsetOrder.rfs === order.rfs) {
            ordersToRemove = ordersToRemove.concat(adjustedTickOffsetList[tickOffsetOrder.rfs]);
            delete adjustedTickOffsetList[tickOffsetOrder.rfs];
          }
        })
      } else {
        newFillOrKillList[betId] = fillOrKillList[betId];
      }
    });

    if (ordersToRemove.length > 0) {
      await fetch('/api/remove-orders', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(ordersToRemove)
      })
    }

    if (Object.values(adjustedUnmatchedBets).length !== Object.values(bets.unmatched).length) {
      onChangeOrders({
        unmatched: adjustedUnmatchedBets,
        matched: bets.matched
      })
    }

    if (Object.keys(tickOffsetList).length > 0) {
      onUpdateTickOffsetList(adjustedTickOffsetList);
    }

    if (Object.keys(fillOrKillList).length > 0) {
      onUpdateFillOrKillList(newFillOrKillList);
    }

  }, ONE_SECOND);

  const renderTime = () => {
    if (!marketOpen) return null;
    else if (marketStatus === "OPEN" || marketStatus === "RUNNING") return msToHMS(timeRemaining);
    else if (marketStatus === "SUSPENDED" || marketStatus === "CLOSED") return marketStatus;
    return null;
  };

  return (
    <div>{renderTime()}</div>
  );
};

const mapStateToProps = state => {
  return {
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
    bets: state.order.bets
  };
};

const matchDispatchToProps = dispatch => {
  return {
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onCancelOrder: order => dispatch(cancelOrder(order)),
    onUpdateLayList: list => dispatch(updateLayList(list)),
    onUpdateBackList: list => dispatch(updateBackList(list)),
    onUpdateFillOrKillList: list => dispatch(updateFillOrKillList(list)),
    onUpdateTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onChangeOrders: orders => dispatch(updateOrders(orders)),
    onPastEventTime: () => dispatch(setPastEventTime()),
  }
};

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);