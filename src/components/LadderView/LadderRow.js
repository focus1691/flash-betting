import React from 'react'
import LadderOrderCell from './LadderOrderCell'
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { findStopPosition, findStopPositionForPercent } from "../../utils/TradingStategy/StopLoss";

export default ({data: { ladder, selectionId, placeOrder, ltp, ltpList, stopLoss, changeStopLossList }, style, index}) => {
    
    const key = Object.keys(ladder)[index]
    const indexInLTPList = ltpList.findIndex(item => item.tick == key);
    // console.log(data[index])
    return (
        <div key={ladder[key].odds}  onContextMenu = { (e) => { e.preventDefault(); return false } } class = 'tr' style = {style} >
          <div className={"candle-stick-col td"} colSpan={3}  >
            {
              indexInLTPList >= 0 ? 
              <img 
                src={`${window.location.origin}/icons/${ltpList[indexInLTPList].color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                className={"candle-stick"} alt = "" style = {{right: indexInLTPList * 2}} /> 
              : null
            }
            
          </div>
          <div className = 'td'>{ladder[key].backProfit}</div>
          <LadderOrderCell 
            side = {"BACK"}
            cell = {ladder[key]}
            selectionId = {selectionId}
            placeOrder = {placeOrder}
            isStopLoss = {stopLoss !== undefined && stopLoss.side == "BACK" ? 
                          stopLoss.units == "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
                          findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
                           : false}
            stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
          />
          <div style = {{
            background: key == ltp ? 'yellow' : '#BBBBBB'
          }} className = 'td'>{formatPrice(ladder[key].odds)}</div>
          <LadderOrderCell 
            side = {"LAY"}
            cell = {ladder[key]}
            selectionId = {selectionId}
            placeOrder = {placeOrder} 
            isStopLoss = {stopLoss !== undefined && stopLoss.side == "LAY" ? 
              stopLoss.units == "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
              findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
               : false}
            stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
          />
          <div className = 'td'>{ladder[key].layProfit}</div>
        </div>
    )
}