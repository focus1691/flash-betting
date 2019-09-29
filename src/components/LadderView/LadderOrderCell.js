import React from 'react'
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { checkStopLossHit } from '../../utils/TradingStategy/StopLoss';

export default ({side, cell, selectionId, placeOrder, isStopLoss, stopLossData, changeStopLossList}) => {

    if (side == "LAY") {
      console.log(isStopLoss)
    }

    return (
        <td
            style={
                isStopLoss ? {background: "yellow"} :
                cell.backMatched && side === "BACK" ? {background: "#F694AA"} : 
                cell.layMatched && side === "LAY" ? {background: "#75C2FD"} : null
            }
            onClick={e => {
              placeOrder({
                side: side,
                price: formatPrice(cell.odds),
                selectionId: selectionId
              })
            }}
            onContextMenu = { e => {
              e.preventDefault()

              changeStopLossList({
                  side: side,
                  price: formatPrice(cell.odds)
              })
              
              return false;
            }}
          >
            { isStopLoss ? stopLossData.size : cell[`${side.toLowerCase()}Matched`] }
        </td>
    )
}