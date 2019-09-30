import React, { useRef } from "react";
import LadderOrderCell from './LadderOrderCell'
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { checkStopLossHit } from "../../utils/TradingStategy/StopLoss";

export default ({ ladder, selectionId, placeOrder, ltp, ltpRef, ltpList = [], stopLoss, changeStopLossList }) => {
  // TODO ltpList
  // const arr = [2.44, 2.50, 2.46, 2.62] for testing, replace ltpList with arr
  const coloredLTPList = ltpList.map((item, index) => {
    if (index === ltpList.length - 1) { // if last element
      return {
        tick: item,
        color: item > ltpList[index - 1] || index === 0 ? 'G' : 'R'
      } 
    } else {
      return {
        tick: item,
        color: item < ltpList[index + 1] ? 'R' : 'G'
      }
    }
  })

  return (
    Object.keys(ladder).map(key => {
      const indexInLTPList = coloredLTPList.findIndex(item => item.tick == key);
      return (
        <tr key={ladder[key].odds} ref = {key == ltp ? ltpRef : null} onContextMenu = { (e) => { e.preventDefault(); return false } }>
          <td className={"candle-stick-col"} colSpan={3} >
            {
              indexInLTPList >= 0 ? 
                <img 
                  src={`${window.location.origin}/icons/${coloredLTPList[indexInLTPList].color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                  className={"candle-stick"} alt = "" style = {{right: indexInLTPList * 2}} /> 
                : null
            }
            
          </td>
          <td>{ladder[key].backProfit}</td>
          <LadderOrderCell 
            side = {"BACK"}
            cell = {ladder[key]}
            selectionId = {selectionId}
            placeOrder = {placeOrder}
            isStopLoss = {stopLoss !== undefined && stopLoss.side == "BACK" ? parseFloat(checkStopLossHit(5, stopLoss.matchedPrice, formatPrice(key), stopLoss.side.toLowerCase(), stopLoss.tickOffset).priceReached).toFixed(2) == key : false}
            stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
          />
          <td style = {{
            background: key == ltp ? 'yellow' : '#BBBBBB'
          }}>{formatPrice(ladder[key].odds)}</td>
          <LadderOrderCell 
            side = {"LAY"}
            cell = {ladder[key]}
            selectionId = {selectionId}
            placeOrder = {placeOrder} // We swap the formatPrice(key), stopLoss.matchedPrice, because it is in a different order if lay
            isStopLoss = {stopLoss !== undefined && stopLoss.side == "LAY" ? parseFloat(checkStopLossHit(5, formatPrice(key), stopLoss.matchedPrice, stopLoss.side.toLowerCase(), stopLoss.tickOffset).priceReached).toFixed(2) == key : false}
            stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
          />
          <td>{ladder[key].layProfit}</td>
        </tr>
      );
    })
  )
}