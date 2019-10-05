import React from 'react'
import { connect } from "react-redux";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { updateTickOffsetList } from '../../actions/tickOffset';
import { findTickOffset } from '../../utils/TradingStategy/TickOffset';
import crypto from 'crypto'
import { updateFillOrKillList } from '../../actions/fillOrKill';

const LadderOrderCell = ({side, cell, unmatchedBets, matchedBets, marketId, selectionId, placeOrder, isStopLoss, stopLossData, stopLossUnits, changeStopLossList, stopLossSelected, 
                          onChangeTickOffsetList, tickOffsetList, tickOffsetSelected, tickOffsetUnits, tickOffsetTicks, tickOffsetTrigger,
                          fillOrKillSelected, fillOrKillSeconds, fillOrKillList, onUpdateFillOrKillList }) => {

    
    return (
        <td
            style={
                isStopLoss ? {background: "yellow"} :
                cell.backMatched && side === "BACK" ? {background: "#F694AA"} : 
                cell.layMatched && side === "LAY" ? {background: "#75C2FD"} : null
            }
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
                orderCompleteCallBack: async betId => {

                  if (stopLossSelected && stopLossData === undefined) {
                    changeStopLossList({
                      side: side === "BACK" ? "LAY" : "BACK",
                      price: formatPrice(cell.odds),
                      custom: false,
                      units: stopLossUnits,
                      rfs: referenceStrategyId,
                      assignedIsOrderMatched: false,
                      betId: betId
                    })
                  } else if (tickOffsetSelected) {
                    const newTickOffset = Object.assign({}, tickOffsetList)
                    const addedOrder = {
                      strategy: "Tick Offset",
                      marketId: marketId, 
                      selectionId: selectionId, 
                      price: findTickOffset(formatPrice(cell.odds), side.toLowerCase(), tickOffsetTicks, tickOffsetUnits === "Percent").priceReached,
                      size: 2, // TODO WE NEED TO PUT A SIZE!
                      side: side, 
                      percentageTrigger: tickOffsetTrigger,
                      rfs: referenceStrategyId,
                      betId: betId
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
            onContextMenu = { e => {
              e.preventDefault()

              // TODO we have to update or save the order if we change it
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
            { isStopLoss ? stopLossData.size : cell[`${side.toLowerCase()}Matched`] }
        </td>
    )
}

const mapStateToProps = state => {
  return {
    marketId: state.market.currentMarket.marketId,
    unmatchedBets: state.order.bets.unmatched,
    matchedBets: state.order.bets.matched,
    stopLossSelected: state.stopLoss.selected,
    stopLossUnits: state.stopLoss.units,
    tickOffsetList: state.tickOffset.list,
    tickOffsetSelected: state.tickOffset.selected,
    tickOffsetTicks: state.tickOffset.ticks,
    tickOffsetUnits: state.tickOffset.units,
    tickOffsetTrigger: state.tickOffset.percentTrigger,
    fillOrKillSelected: state.fillOrKill.selected,
    fillOrKillSeconds: state.fillOrKill.seconds,
    fillOrKillList: state.fillOrKill.list,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onUpdateFillOrKillList: list => dispatch(updateFillOrKillList(list))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LadderOrderCell)