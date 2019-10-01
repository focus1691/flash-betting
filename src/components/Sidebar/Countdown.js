import React, { useState } from "react";
import { connect } from "react-redux";
import useInterval from "react-useinterval";
import { placeOrder, cancelOrder } from "../../actions/order";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
import { updateFillOrKillList } from "../../actions/fillOrKill";
import { checkTimeListsBefore } from '../../utils/TradingStategy/BackLay'


const Countdown = props => {
  const ONE_SECOND = 1000;
  const [timeRemaining, setTimeRemaining] = useState("--");

  useInterval(() => {
    setTimeRemaining(
      props.market ? new Date(props.market.marketStartTime) - new Date() : "--"
    );
    
    props.onUpdateBackList(checkTimeListsBefore(props.backList, props.market.marketStartTime, props.onPlaceOrder, props.market.marketId, "BACK"))
    props.onUpdateLayList(checkTimeListsBefore(props.layList, props.market.marketStartTime, props.onPlaceOrder, props.market.marketId, "LAY"))

    const newFillOrKillList = {};
    Object.keys(props.fillOrKillList).map((betId, index) => {
      const order = props.fillOrKillList[betId]; 
      if ((Date.now() / 1000) - (order.startTime / 1000) >= order.seconds) {
        props.onCancelOrder({
          marketId: props.market.marketId,
          betId: betId,
          sizeReduction: null
        })
      } else {
        newFillOrKillList[betId] = props.fillOrKillList[betId]
      }
    })

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
    market: state.market.currentMarket,
    layList: state.lay.list,
    backList: state.back.list,
    fillOrKillList: state.fillOrKill.list
  };
};

const matchDispatchToProps = dispatch => {
  return {
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onCancelOrder: order => dispatch(cancelOrder(order)),
    onUpdateLayList: list => dispatch(updateLayList(list)),
    onUpdateBackList: list => dispatch(updateBackList(list)),
    onUpdateFillOrKillList: list => dispatch(updateFillOrKillList(list))
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);

