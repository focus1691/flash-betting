import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { placeOrder } from "../../actions/order";
import { setRunner, updateLadderOrder } from "../../actions/market";
import Ladder from './Ladder'
import LadderHeader from "./LadderHeader";
import LadderBody from "./LadderBody";
import PercentageRow from "./PercentageRow";
import PriceRow from "./PriceRow";
import OrderRow from "./OrderRow";

const Ladders = ({ladderOrder, ladder, onChangeLadderOrder, marketOpen, excludedLadders, runners, market, onPlaceOrder, onSelectRunner}) => {

  useEffect(() => {
    if (Object.keys(ladderOrder).length === 0 && Object.keys(ladder).length > 0) {
        // initialize the order object
        const newOrderList = {};

        Object.keys(ladder).map((key, index) => {
          newOrderList[index] = key;
        })
        
        onChangeLadderOrder(newOrderList);
    }
  }, [ladder])

  return (
    <div className={"ladder-container"}>
      {marketOpen && ladder
        ? Object.values(ladderOrder)
          .filter(value => excludedLadders.indexOf(value) === -1)
          .map(value => 
          <Ladder 
            runners = {runners}
            ladder = {ladder}
            market = {market}
            onPlaceOrder = {onPlaceOrder}
            onSelectRunner = {onSelectRunner}
            id = {value}
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
    excludedLadders: state.market.excludedLadders,
    ladderOrder: state.market.ladderOrder,
    bets: state.order.bets
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(setRunner(runner)),
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onChangeLadderOrder: order => dispatch(updateLadderOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);
