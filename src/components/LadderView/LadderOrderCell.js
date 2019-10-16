import React from 'react'
import { connect } from "react-redux";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { updateTickOffsetList } from '../../actions/tickOffset';
import { findTickOffset } from '../../utils/TradingStategy/TickOffset';
import crypto from 'crypto'
import { updateFillOrKillList } from '../../actions/fillOrKill';

const LadderOrderCell = ({side, cell, unmatchedBets, matchedBets, marketId, selectionId, placeOrder, 
                          isStopLoss, stopLossData, stopLossUnits, changeStopLossList, stopLossSelected, stopLossList, stopLossHedged,
                          onChangeTickOffsetList, tickOffsetList, tickOffsetSelected, tickOffsetUnits, tickOffsetTicks, tickOffsetTrigger, tickOffsetHedged,
                          fillOrKillSelected, fillOrKillSeconds, fillOrKillList, onUpdateFillOrKillList, hedgeSize, onHover, onLeave, stakeVal }) => {

    
    return (
        <div className = 'td'
            style={
                isStopLoss ? {background: "yellow"} :
                cell.backMatched && side === "BACK" ? {background: "#F694AA"} : 
                cell.layMatched && side === "LAY" ? {background: "#75C2FD"} : null
            }
            onMouseEnter = {onHover}
            onMouseLeave = {onLeave}
            onClick={e => {

              const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15)
              
              // stoploss and fill or kill can't be together, stoploss takes priority
              placeOrder({
                side: side,
                price: formatPrice(cell.odds),
                selectionId: selectionId,
                customerStrategyRef: referenceStrategyId,
                unmatchedBets: unmatchedBets,
                matchedBets: matchedBets, 
                size: stakeVal[selectionId],
                orderCompleteCallBack: async betId => {

                  if (stopLossSelected && stopLossData === undefined) {
                    changeStopLossList({
                      side: side === "BACK" ? "LAY" : "BACK",
                      price: formatPrice(cell.odds),
                      custom: false,
                      units: stopLossUnits,
                      rfs: referenceStrategyId,
                      assignedIsOrderMatched: false,
                      size: stakeVal[selectionId],
                      betId: betId,
                      hedged: stopLossHedged
                    })
                  } else if (tickOffsetSelected) {
                    const newTickOffset = Object.assign({}, tickOffsetList)
                    const addedOrder = {
                      strategy: "Tick Offset",
                      marketId: marketId, 
                      selectionId: selectionId, 
                      price: findTickOffset(formatPrice(cell.odds), side.toLowerCase(), tickOffsetTicks, tickOffsetUnits === "Percent").priceReached,
                      size: tickOffsetHedged ? hedgeSize : stakeVal[selectionId], 
                      side: side, 
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
              })

              

            }}
            onContextMenu = { async e => {
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
                side: side,
                price: formatPrice(cell.odds),
                custom: true,
                rfs: undefined,
                assignedIsOrderMatched: false,
              })

              return false;
            }}
          >
            { isStopLoss ? stopLossData.hedged ? "H" : stopLossData.size : cell[`${side.toLowerCase()}Matched`] }
        </div>
    )
}

const mapStateToProps = state => {
  return {
    marketId: state.market.currentMarket.marketId,
    unmatchedBets: state.order.bets.unmatched,
    matchedBets: state.order.bets.matched,
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
    stakeVal: state.settings.stake
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onUpdateFillOrKillList: list => dispatch(updateFillOrKillList(list))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LadderOrderCell)