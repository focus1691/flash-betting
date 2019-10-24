import React, { useState } from "react";
import { connect } from "react-redux";
import useInterval from "react-useinterval";
import { placeOrder, cancelOrder, updateOrders } from "../../actions/order";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { updateTickOffsetList } from "../../actions/tickOffset";
import { checkTimeListsBefore } from '../../utils/TradingStategy/BackLay'


const Countdown = props => {
  const ONE_SECOND = 1000;
  const [timeRemaining, setTimeRemaining] = useState("--");

  const calculateTime = () => {
    if (!props.market) {
      return "--";
    }
    if (new Date() < new Date(props.market.marketStartTime)) {
      return new Date(props.market.marketStartTime) - new Date();
    }
    else if (new Date() > new Date(props.market.marketStartTime)) {;
      return Math.abs(new Date(props.market.marketStartTime) - new Date());
    } else {
      return "--";
    }
  }

  useInterval(async () => {
    setTimeRemaining(calculateTime());

    const newBackList = await checkTimeListsBefore(props.backList, props.market.marketStartTime, props.onPlaceOrder, props.market.marketId, "BACK", props.bets.matched, props.bets.unmatched)
    props.onUpdateBackList(newBackList)

    const newLayList = await checkTimeListsBefore(props.layList, props.market.marketStartTime, props.onPlaceOrder, props.market.marketId, "LAY", props.bets.matched, props.bets.unmatched)
    props.onUpdateLayList(newLayList)


    const newFillOrKillList = {};
    const adjustedTickOffsetList = Object.assign({}, props.tickOffsetList);
    const adjustedUnmatchedBets = Object.assign({}, props.bets.unmatched);
    let ordersToRemove = [];

    Object.keys(props.fillOrKillList).map((betId, index) => {
      const order = props.fillOrKillList[betId];
      if ((Date.now() / 1000) - (order.startTime / 1000) >= order.seconds) {
        props.onCancelOrder({
          marketId: props.market.marketId,
          betId: betId,
          sizeReduction: null,
          matchedBets: props.bets.matched,
          unmatchedBets: props.bets.unmatched
        })

        ordersToRemove = ordersToRemove.concat(order);

        if (adjustedUnmatchedBets[betId] !== undefined) {
          ordersToRemove = ordersToRemove.concat(adjustedUnmatchedBets[betId])
          delete adjustedUnmatchedBets[betId];
        }

        Object.values(props.tickOffsetList).map(tickOffsetOrder => {
          if (tickOffsetOrder.rfs === order.rfs) {
            ordersToRemove = ordersToRemove.concat(adjustedTickOffsetList[tickOffsetOrder.rfs]);
            delete adjustedTickOffsetList[tickOffsetOrder.rfs];
          }
        })



      } else {
        newFillOrKillList[betId] = props.fillOrKillList[betId]
      }
    })

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

    props.onChangeOrders({
      unmatched: adjustedUnmatchedBets,
      matched: props.bets.matched
    })
    props.onUpdateTickOffsetList(adjustedTickOffsetList)
    props.onUpdateFillOrKillList(newFillOrKillList);

  }, ONE_SECOND);

  const padZeroes = num => {
    var str = num.toString();

    while (str.length < 2) {
      str = "0".concat(str);
    }
    return str;
  };

  const msToHMS = ms => {
    if (typeof ms !== "number") return "--";

    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = Math.floor(parseInt(seconds / 3600)); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = Math.floor(parseInt(seconds / 60)); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = Math.floor(seconds % 60);

    return Math.abs(hours) <= 0 && minutes <= 0 && seconds <= 0
      ? "00:00:00"
      : `${hours}:${padZeroes(minutes)}:${padZeroes(seconds)}`;
  };
  return (
    <div>
      {props.marketOpen
        ? props.marketStatus === "OPEN"
          ? msToHMS(timeRemaining)
          : props.marketStatus === "SUSPENDED" ||
            props.marketStatus === "CLOSED"
            ? props.marketStatus
            : "00:00:00"
        : null}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    marketStatus: state.market.status,
    inPlay: state.market.inPlay,
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
    onChangeOrders: orders => dispatch(updateOrders(orders))
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);

