import React from 'react'
import { connect } from "react-redux";
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { checkStopLossHit } from '../../utils/TradingStategy/StopLoss';

const LadderOrderCell = ({side, cell, selectionId, placeOrder, isStopLoss, stopLossData, changeStopLossList, selected,  }) => {

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

              if (selected && stopLossData === undefined) {
                changeStopLossList({
                  side: side === "BACK" ? "LAY" : "BACK",
                  price: formatPrice(cell.odds),
                  custom: false,
                })
              }

            }}
            onContextMenu = { e => {
              e.preventDefault()

              changeStopLossList({
                  side: side,
                  price: formatPrice(cell.odds),
                  custom: true,
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