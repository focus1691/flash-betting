import React from 'react'
import { connect } from 'react-redux'
import LadderOrderCell from './LadderOrderCell'
import { formatPrice, ALL_PRICES } from "../../utils/ladder/CreateFullLadder";
import { findStopPosition, findStopPositionForPercent } from "../../utils/TradingStategy/StopLoss";
import crypto from 'crypto'

export default ({data: { ladder, selectionId, placeOrder, cancelOrder, ltp, ltpList, stopLoss, changeStopLossList, hedgeSize, setOddsHovered, volume, ladderSideLeft, selectionUnmatched, marketId, matchedBets, unmatchedBets }, style, index}) => {
    const key = ALL_PRICES[ALL_PRICES.length - index - 1]
    
    const indexInLTPList = -1;
    const volumeVal = 0;

    const leftSide = "LAY"
    const rightSide = "BACK"

    const unmatchedBetOnRow = undefined;

    const handleContextMenu = () => e => {
      e.preventDefault();
      return false;
    };

    return (
        <div key={key}  onContextMenu = {handleContextMenu()} className={"tr"} style = {style} >
          
          <div className={"candle-stick-col td"} colSpan={3}>
            {
              indexInLTPList >= 0 ? 
              <img 
                src={`${window.location.origin}/icons/${ltpList[indexInLTPList].color === 'R' ? 'red-candle.png' : 'green-candle.png'}`} 
                className={"candle-stick"} alt = "" style = {{right: indexInLTPList * 2}} /> 
              : null
            }
            <div className={"volume-col"} style={{width: `${volumeVal * 10}px`}}>
              {volumeVal === 0 ? null : volumeVal}
            </div>
          </div>

          <div 
            className = 'td'
            // style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === leftSide ? 'black' : `${ladder[key][leftSideProfit] >= 0 ? "green" : 'red'}`}}
            // onClick = {handleHedgeCellClick(0)}
          >
              {/* {unmatchedBetOnRow && unmatchedBetOnRow.side === leftSide ? unmatchedBetOnRow.size : ladder[key][leftSideProfit]} */}
            </div>
          <LadderOrderCell 
            side = {leftSide}
            selectionId = {selectionId}
            price = {key}
            // ladderSideLeft = {ladderSideLeft}
            // cell = {ladder[key]}
            // selectionId = {selectionId}
            // placeOrder = {placeOrder}
            // isStopLoss = {stopLoss !== undefined && stopLoss.side === leftSide ? 
            //               stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
            //               findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
            //                : false}
            // stopLossData = {stopLoss}
            // changeStopLossList= {changeStopLossList}
            // hedgeSize = {hedgeSize}
            onHover = {() => setOddsHovered({selectionId, odds: key, side: leftSide})}
            onLeave = {() => setOddsHovered({selectionId, odds: 0, side: leftSide})}
          />
          <div style = {{
            background: key == ltp ? 'yellow' : '#BBBBBB'
          }} className = 'td'>{formatPrice(key)}</div>
          <LadderOrderCell 
            side = {rightSide}
            selectionId = {selectionId}
            price = {key}
            // ladderSideLeft = {ladderSideLeft}
            // cell = {ladder[key]}
            // selectionId = {selectionId}
            // placeOrder = {placeOrder} 
            // isStopLoss = {stopLoss !== undefined && stopLoss.side === rightSide ? 
            //   stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
            //   findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
            //    : false}
            // stopLossData = {stopLoss}
            // changeStopLossList= {changeStopLossList}
            // hedgeSize = {hedgeSize}
            onHover = {() => setOddsHovered({selectionId, odds: key, side: leftSide})}
            onLeave = {() => setOddsHovered({selectionId, odds: 0, side: leftSide})}
          />
          <div 
            className = 'td'
            // style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === rightSide ? 'black' : `${ladder[key][rightSideProfit] >= 0 ? "green" : 'red'}`}}
            // onClick = {handleHedgeCellClick(1)}
          >{}</div>
        </div>
    )
}