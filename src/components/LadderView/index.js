import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { placeOrder } from "../../actions/order";
import { setRunner } from "../../actions/market";
import Ladder from './Ladder'
import LadderHeader from "./LadderHeader";
import LadderBody from "./LadderBody";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";

const Ladders = props => {
  return (
    <div className={"ladder-container"}>
      {props.marketOpen && props.ladder
        ? Object.keys(props.ladder).map(key => 
          <Ladder 
            runners = {props.runners}
            ladder = {props.ladder}
            market = {props.market}
            onPlaceOrder = {props.onPlaceOrder}
            onSelectRunner = {props.onSelectRunner}
            id = {key}
          />
        )
      : null } 
    </div>
  );
};

const mapStateToProps = state => {
  return {
    currentEvent: state.sports.currentSport.currentEvent,
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    runners: state.market.runners,
    ladder: state.market.ladder,
    bets: state.order.bets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(setRunner(runner)),
    onPlaceOrder: order => dispatch(placeOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);
