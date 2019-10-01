import React, { useState } from "react";
import { connect } from "react-redux";
import useInterval from "react-useinterval";
import { placeOrder } from "../../actions/order";
import { updateLayList } from "../../actions/lay";
import { updateBackList } from "../../actions/back";
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
    backList: state.back.list
  };
};

const matchDispatchToProps = dispatch => {
  return {
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onUpdateLayList: list => dispatch(updateLayList(list)),
    onUpdateBackList: list => dispatch(updateBackList(list))
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(Countdown);

