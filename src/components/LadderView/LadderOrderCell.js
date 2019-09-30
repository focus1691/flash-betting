import React from 'react'
import { connect } from "react-redux";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { updateTickOffsetList } from '../../actions/tickOffset';
import { findTickOffset } from '../../utils/TradingStategy/TickOffset';
import crypto from 'crypto'

const LadderOrderCell = ({side, cell, price, marketId, selectionId, placeOrder, isStopLoss, stopLossData, stopLossUnits, changeStopLossList, stopLossSelected, 
                          onChangeTickOffsetList, tickOffsetList, tickOffsetSelected, tickOffsetUnits, tickOffsetTicks, tickOffsetTrigger }) => {

    return (
        <td
            style={
                isStopLoss ? {background: "yellow"} :
                cell.backMatched && side === "BACK" ? {background: "#F694AA"} : 
                cell.layMatched && side === "LAY" ? {background: "#75C2FD"} : null
            }
            onClick={e => {

              const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15)
              
              placeOrder({
                side: side,
                price: formatPrice(cell.odds),
                selectionId: selectionId,
                customerStrategyRef: referenceStrategyId
              })

              if (stopLossSelected && stopLossData === undefined) {
                changeStopLossList({
                  side: side === "BACK" ? "LAY" : "BACK",
                  price: formatPrice(cell.odds),
                  custom: false,
                  units: stopLossUnits,
                  rfs: referenceStrategyId,
                  assignedIsOrderMatched: false,
                })
              }

              if (tickOffsetSelected) {
                const newTickOffset = Object.assign({}, tickOffsetList)

                newTickOffset[referenceStrategyId] = {
                  marketId: marketId, 
                  selectionId: selectionId, 
                  matchedPrice: formatPrice(cell.odds), 
                  newPrice: findTickOffset(formatPrice(cell.odds), side.toLowerCase(), tickOffsetTicks, tickOffsetTrigger).priceReached,
                  size: 5, 
                  side: side, 
                  tickOffset: tickOffsetUnits === "Ticks" ? tickOffsetTicks : "TODO", 
                  percentage: tickOffsetTrigger, 
                  rfs: referenceStrategyId
                }

                onChangeTickOffsetList(newTickOffset);
              }


            }}
            onContextMenu = { e => {
              e.preventDefault()

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
    stopLossSelected: state.stopLoss.selected,
    stopLossUnits: state.stopLoss.units,
    tickOffsetList: state.tickOffset.list,
    tickOffsetSelected: state.tickOffset.selected,
    tickOffsetTicks: state.tickOffset.ticks,
    tickOffsetUnits: state.tickOffset.units,
    tickOffsetTrigger: state.tickOffset.percentTrigger,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LadderOrderCell)