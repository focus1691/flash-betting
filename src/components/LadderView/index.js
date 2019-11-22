import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { placeOrder, updateOrders } from "../../actions/order";
import { setRunner, updateLadderOrder, changeLadderSideLeft } from "../../actions/market";
import { updateStopLossList } from "../../actions/stopLoss";
import Ladder from './Ladder'

const Ladders = ({ladderOrder, ladder, sortedLadder, onChangeLadderOrder, marketOpen, marketStatus, excludedLadders, runners, market, onPlaceOrder, onSelectRunner, stopLossList, 
                  stopLossOffset, stopLossTrailing, onChangeStopLossList, marketVolume, bets, ladderUnmatched, stakeVal, ladderSideLeft, onChangeLadderSideLeft, onUpdateBets}) => {

  const [oddsHovered, setOddsHovered] = useState({selectionId: 0, odds: 0, side: "BACK"}) 

  useEffect(() => {
    if (Object.keys(ladderOrder).length === 0 && Object.keys(sortedLadder).length > 0) {
        // initialize the order object
        const newOrderList = {};

        sortedLadder.map((key, index) => {
          newOrderList[index] = key;
        })

        onChangeLadderOrder(newOrderList);
    }
  }, [ladder])

  const newMatchedBets = {}; //selectionId: [{}]
  Object.values(bets.matched).map(bet => {
    if (newMatchedBets[bet.selectionId] === undefined) {
      newMatchedBets[bet.selectionId] = [bet];
    } else {
      newMatchedBets[bet.selectionId] = newMatchedBets[bet.selectionId].concat(bet);
    }
  });

  const swapLadders = (fromIndex, toIndex) => {
    const newOrderList = Object.assign({}, ladderOrder);

    newOrderList[fromIndex] = ladderOrder[toIndex];
    newOrderList[toIndex] = ladderOrder[fromIndex];

    onChangeLadderOrder(newOrderList);
  }

  
  return (
    marketOpen && (marketStatus === "SUSPENDED" || marketStatus === "OPEN" || marketStatus === "RUNNING") ?                          
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
              stopLoss = {stopLossList[value]}
              selectionMatchedBets = {newMatchedBets[value]}
              unmatchedBets = {bets.unmatched}
              matchedBets = {bets.matched}
              setOddsHovered = {setOddsHovered}
              oddsHovered = {oddsHovered}
              volume = {marketVolume[value]}
              ladderUnmatched = {ladderUnmatched}
              stake = {stakeVal[value]}
              ladderSideLeft = {ladderSideLeft}
              setLadderSideLeft = {onChangeLadderSideLeft}
              onUpdateBets = {onUpdateBets}
              changeStopLossList = {async newStopLoss => {

                const adjustedNewStopLoss = {...newStopLoss, 
                  strategy: "Stop Loss",
                  tickOffset: newStopLoss.customStopLoss ? 0 : stopLossOffset,
                  trailing: newStopLoss.customStopLoss ? false : stopLossTrailing
                }

                const newStopLossList = Object.assign({}, stopLossList) 
                newStopLossList[newStopLoss.selectionId] = adjustedNewStopLoss

                await fetch('/api/save-order', {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  method: "POST",
                  body: JSON.stringify(adjustedNewStopLoss)
                })

                onChangeStopLossList(newStopLossList);

              }}
              swapLadders = {swapLadders}
            />
            ))
        : null } 
      </div>
    : null
  );
};

const mapStateToProps = state => {
  return {
    currentEvent: state.sports.currentSport.currentEvent,
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    marketStatus: state.market.status,
    marketVolume: state.market.currentMarketVolume,
    runners: state.market.runners,
    ladder: state.market.ladder,
    sortedLadder: state.market.sortedLadder,
    excludedLadders: state.market.excludedLadders,
    ladderOrder: state.market.ladderOrder,
    bets: state.order.bets,
    stopLossList: state.stopLoss.list,
    stopLossSelected: state.stopLoss.selected,
    stopLossOffset: state.stopLoss.offset,
    stopLossUnits: state.stopLoss.ticks,
    stopLossTrailing: state.stopLoss.trailing,
    stopLossHedged: state.stopLoss.hedged,
    ladderUnmatched: state.settings.ladderUnmatched,
    stakeVal: state.settings.stake,
    ladderSideLeft: state.market.ladderSideLeft
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectRunner: runner => e => dispatch(setRunner(runner)),
    onPlaceOrder: order => dispatch(placeOrder(order)),
    onUpdateBets: bets => dispatch(updateOrders(bets)),
    onChangeLadderOrder: order => dispatch(updateLadderOrder(order)),
    onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    onChangeLadderSideLeft: side => dispatch(changeLadderSideLeft(side))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Ladders);
