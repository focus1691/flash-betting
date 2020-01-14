import crypto from 'crypto';
import React, { memo } from 'react';
import { connect } from "react-redux";
import { updateFillOrKillList } from '../../actions/fillOrKill';
import { updateTickOffsetList } from '../../actions/tickOffset';
import { getMatched } from '../../selectors/marketSelector';
import { getStopLoss } from '../../selectors/stopLossSelector';
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { findTickOffset } from '../../utils/TradingStategy/TickOffset';

const LadderOrderCell = ({side, price, cell, unmatchedBets, matchedBets, marketId, selectionId, placeOrder, 
                          isStopLoss, stopLoss, stopLossData, stopLossUnits, changeStopLossList, stopLossSelected, stopLossList, stopLossHedged,
                          onChangeTickOffsetList, tickOffsetList, tickOffsetSelected, tickOffsetUnits, tickOffsetTicks, tickOffsetTrigger, tickOffsetHedged,
                          fillOrKillSelected, fillOrKillSeconds, fillOrKillList, onUpdateFillOrKillList, hedgeSize, onHover, onLeave, stakeVal, cellMatched }) => {
                            
    const handleClick = () => async e => {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15)
      
      // stoploss and fill or kill can't be together, stoploss takes priority
      placeOrder({
        side: side,
        price: formatPrice(price),
        marketId: marketId,
        selectionId: selectionId,
        customerStrategyRef: referenceStrategyId,
        unmatchedBets: unmatchedBets,
        matchedBets: matchedBets, 
        size: stakeVal[selectionId],
        orderCompleteCallBack: async betId => {

          if (stopLossSelected && stopLossData === undefined) {
            changeStopLossList({
              side: side === "BACK" ? "LAY" : "BACK",
              price: formatPrice(price),
              custom: false,
              units: stopLossUnits,
              rfs: referenceStrategyId,
              assignedIsOrderMatched: false,
              size: stakeVal[selectionId],
              betId: betId,
              hedged: stopLossHedged,
              marketId: marketId,
            })
          } else if (tickOffsetSelected) {
            const newTickOffset = Object.assign({}, tickOffsetList);
            const addedOrder = {
              strategy: "Tick Offset",
              marketId: marketId, 
              selectionId: selectionId, 
              price: findTickOffset(formatPrice(price), side.toLowerCase() === 'lay' ? 'back' : 'lay', tickOffsetTicks, tickOffsetUnits === "Percent").priceReached,
              size: tickOffsetHedged ? hedgeSize : stakeVal[selectionId], 
              side: side === "BACK" ? "LAY" : "BACK", 
              percentageTrigger: tickOffsetTrigger,
              rfs: referenceStrategyId,
              betId: betId,
              hedged: tickOffsetHedged,
              minFillSize: fillOrKillSelected ? (tickOffsetHedged ? hedgeSize : stakeVal[selectionId]) : 1
            };

            newTickOffset[referenceStrategyId] = addedOrder

            await fetch('/api/save-order', {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify(addedOrder)
            })
            onChangeTickOffsetList(newTickOffset);
            
          }

          if (!stopLossSelected && fillOrKillSelected) {
            const addedFillOrKillOrder = {strategy: "Fill Or Kill", marketId: marketId, selectionId: selectionId, seconds: fillOrKillSeconds, startTime: Date.now(), betId: betId, rfs: referenceStrategyId};
            const newFillOrKillList = Object.assign({}, fillOrKillList);
            newFillOrKillList[betId] = addedFillOrKillOrder;

            await fetch('/api/save-order', {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify(addedFillOrKillOrder)
            })
            onUpdateFillOrKillList(newFillOrKillList);
          }
        },
      });
    };

    const handleRightClick = () => async e => {
      e.preventDefault()

      if (stopLossList[selectionId] !== undefined) {
        await fetch('/api/remove-orders', {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify([stopLossList[selectionId]])
        })
      }
      
      changeStopLossList({
        marketId: marketId,
        side: side,
        size: stakeVal[selectionId], 
        price: formatPrice(price),
        custom: true,
        rfs: undefined,
        assignedIsOrderMatched: false,
      });

      return false;
    };
    return (
        <div className = 'td'
            style={
                stopLoss ? {background: "yellow"} :
                cellMatched.side === "BACK" && cellMatched.matched !== null && side === "BACK" ? {background: "#75C2FD"} : 
                cellMatched.side === "LAY" && cellMatched.matched !== null && side === "LAY" ? {background: "#F694AA"} : 
                side === "LAY" ? {background: "#FCC9D3"} : 
                side === "BACK" ? {background: "#BCE4FC"} : 
                null
            }
            onMouseEnter = {onHover}
            onMouseLeave = {onLeave}
            onClick={handleClick()}
            onContextMenu = {handleRightClick()}
          >
            { stopLoss ? (stopLoss.hedged ? "H" : stopLoss.stopLoss.size) : cellMatched.matched }
        </div>
    )
}

const mapStateToProps = (state, props) => {
  return {
    marketId: state.market.currentMarket.marketId,
    unmatchedBets: state.order.bets.unmatched,
    matchedBets: state.order.bets.matched,
    stopLoss: getStopLoss(state.stopLoss.list, props),
    stopLossSelected: state.stopLoss.selected,
    stopLossList: state.stopLoss.list,
    stopLossUnits: state.stopLoss.units,
    stopLossHedged: state.stopLoss.hedged, 
    tickOffsetList: state.tickOffset.list,
    tickOffsetSelected: state.tickOffset.selected,
    tickOffsetTicks: state.tickOffset.ticks,
    tickOffsetUnits: state.tickOffset.units,
    tickOffsetTrigger: state.tickOffset.percentTrigger,
    tickOffsetHedged: state.tickOffset.hedged, 
    fillOrKillSelected: state.fillOrKill.selected,
    fillOrKillSeconds: state.fillOrKill.seconds,
    fillOrKillList: state.fillOrKill.list,
    stakeVal: state.settings.stake,
    cellMatched: getMatched(state.market.ladder, props),

  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onUpdateFillOrKillList: list => dispatch(updateFillOrKillList(list)),

  }
}

const isMoving = (prevProps, nextProps) => {
  if (nextProps.isMoving) {
      return true;
  } else {
      return false;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(memo(LadderOrderCell, isMoving))