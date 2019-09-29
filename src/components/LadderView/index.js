import React, { useRef, useEffect } from "react";
import { connect } from "react-redux";
import { placeOrder } from "../../actions/order";
import { setRunner, updateLadderOrder } from "../../actions/market";
import { updateStopLossList } from "../../actions/stopLoss";
import Ladder from './Ladder'

const Ladders = ({ladderOrder, ladder, onChangeLadderOrder, marketOpen, excludedLadders, runners, market, onPlaceOrder, onSelectRunner, stopLossList, 
                  stopLossOffset, stopLossUnits, stopLossTrailing, stopLossHedged , onChangeStopLossList}) => {

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
    <div className={"ladder-container"}
      onContextMenu = { (e) => { e.preventDefault(); return false } }
    >
      {marketOpen && ladder
        ? Object.values(ladderOrder)
          .filter(value => excludedLadders.indexOf(value) === -1)
          .map((value, index) => (
          <Ladder 
            runners = {runners}
            ladder = {ladder}
            market = {market}
            onPlaceOrder = {onPlaceOrder}
            onSelectRunner = {onSelectRunner}
            id = {value}
            key = {value}
            order = {index}
            ladderOrderList = {ladderOrder}
            stopLoss = { stopLossList.find(stopLoss => stopLoss.selectionId == value) }
            changeStopLossList = {newStopLoss => {

              const stopLossIndex = stopLossList.findIndex(stopLoss => stopLoss.selectionId == newStopLoss.selectionId)

              const adjustedNewStopLoss = {...newStopLoss, 
                tickOffset: newStopLoss.customStopLoss ? 0 : stopLossOffset,
                trailing: newStopLoss.customStopLoss ? false : stopLossTrailing
              }

              if (stopLossIndex === -1) {

                const newStopLossList = stopLossList.concat(adjustedNewStopLoss)
                onChangeStopLossList(newStopLossList);

              } else { // this is when you manually change it

                const newStopLossList = [...stopLossList]; 
                newStopLossList[stopLossIndex] = adjustedNewStopLoss;
                onChangeStopLossList(newStopLossList);
              }

            }}
            swapLadders = {(fromIndex, toIndex) => {
              const newOrderList = Object.assign({}, ladderOrder);

              newOrderList[fromIndex] = ladderOrder[toIndex];
              newOrderList[toIndex] = ladderOrder[fromIndex];

              onChangeLadderOrder(newOrderList);
            }}
          />
          ))
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
    bets: state.order.bets,
    stopLossList: state.stopLoss.list,
    stopLossSelected: state.stopLoss.selected,
    stopLossOffset: state.stopLoss.offset,
    stopLossUnits: state.stopLoss.ticks,
    stopLossTrailing: state.stopLoss.trailing,
    stopLossHedged: state.stopLoss.hedged,

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => dispatch(setRunner(runner)),
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onChangeLadderOrder: order => dispatch(updateLadderOrder(order)),
    onChangeStopLossList: list => dispatch(updateStopLossList(list))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);
