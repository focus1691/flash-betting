import React from 'react'
import { connect } from "react-redux";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import crypto from 'crypto'

const LadderOrderCell = ({side, cell, selectionId, placeOrder, isStopLoss, stopLossData, changeStopLossList, selected,  }) => {

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
                rfs: referenceStrategyId
              })

              if (selected && stopLossData === undefined) {
                changeStopLossList({
                  side: side === "BACK" ? "LAY" : "BACK",
                  price: formatPrice(cell.odds),
                  custom: false,
                  customerStrategyRef: referenceStrategyId,
                  assignedIsOrderMatched: false,
                })
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
    selected: state.stopLoss.selected,
  };
};

export default connect(mapStateToProps)(LadderOrderCell)