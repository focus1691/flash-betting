import React from 'react'
import LadderOrderCell from './LadderOrderCell'
import { formatPrice } from "../../utils/ladder/CreateFullLadder";
import { findStopPosition, findStopPositionForPercent } from "../../utils/TradingStategy/StopLoss";
import crypto from 'crypto'

export default ({data: { ladder, selectionId, placeOrder, cancelOrder, ltp, ltpList, stopLoss, changeStopLossList, hedgeSize, setOddsHovered, volume, ladderSideLeft, selectionUnmatched, marketId, matchedBets, unmatchedBets }, style, index}) => {
    const key = Object.keys(ladder)[index]
    
    const indexInLTPList = ltpList.findIndex(item => item.tick == key);
    const volumeVal = volume[formatPrice(ladder[key].odds)] ? volume[formatPrice(ladder[key].odds)] : 0;

    const leftSide = ladderSideLeft === "LAY" ? "LAY" : "BACK";
    const leftSideProfit = ladderSideLeft === "LAY" ? 'layProfit' : 'backProfit';
    const rightSide = ladderSideLeft === "LAY" ? "BACK" : "LAY";
    const rightSideProfit = ladderSideLeft === "LAY" ? 'backProfit' : 'layProfit';

    const unmatchedBetOnRow = selectionUnmatched[parseFloat(key)];

    const handleContextMenu = () => e => {
      e.preventDefault();
      return false;
    };

    const handleHedgeCellClick = clickSide => e => {
      const referenceStrategyId = crypto.randomBytes(15).toString('hex').substring(0, 15);

      // CANCEL ORDER IF CLICK UNMATCHED BET
      if (unmatchedBetOnRow) {
        cancelOrder({
          marketId: marketId,
          betId: unmatchedBetOnRow.betId,
          sizeReduction: null,
          matchedBets: matchedBets,
          unmatchedBets: unmatchedBets
        })
      }
      else if (!unmatchedBetOnRow && hedgeSize > 0) {
        placeOrder({
          side: clickSide === 0 ? leftSide : rightSide,
          price: formatPrice(ladder[key].odds),
          selectionId: selectionId,
          customerStrategyRef: referenceStrategyId,
          size: hedgeSize + parseFloat(ladder[key][clickSide === 0 ? leftSideProfit : rightSideProfit])
        });
      }
    };

    return (
        <div key={ladder[key].odds}  onContextMenu = {handleContextMenu()} class = 'tr' style = {style} >
          
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
            style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === leftSide ? 'black' : `${ladder[key][leftSideProfit] >= 0 ? "green" : 'red'}`}}
            onClick = {handleHedgeCellClick(0)}>
              {unmatchedBetOnRow && unmatchedBetOnRow.side === leftSide ? unmatchedBetOnRow.size : ladder[key][leftSideProfit]}
            </div>
          <LadderOrderCell 
            side = {leftSide}
            ladderSideLeft = {ladderSideLeft}
            cell = {ladder[key]}
            selectionId = {selectionId}
            placeOrder = {placeOrder}
            isStopLoss = {stopLoss !== undefined && stopLoss.side === leftSide ? 
                          stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
                          findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
                           : false}
            stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
            hedgeSize = {hedgeSize}
            onHover = {() => setOddsHovered({selectionId, odds: ladder[key].odds, side: leftSide})}
            onLeave = {() => setOddsHovered({selectionId, odds: 0, side: leftSide})}
          />
          <div style = {{
            background: key == ltp ? 'yellow' : '#BBBBBB'
          }} className = 'td'>{formatPrice(ladder[key].odds)}</div>
          <LadderOrderCell 
            side = {rightSide}
            ladderSideLeft = {ladderSideLeft}
            cell = {ladder[key]}
            selectionId = {selectionId}
            placeOrder = {placeOrder} 
            isStopLoss = {stopLoss !== undefined && stopLoss.side === rightSide ? 
              stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
              findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
               : false}
            stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
            hedgeSize = {hedgeSize}
            onHover = {() => setOddsHovered({selectionId, odds: ladder[key].odds, side: rightSide})}
            onLeave = {() => setOddsHovered({selectionId, odds: 0, side: rightSide})}
          />
          <div 
            className = 'td'
            style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === rightSide ? 'black' : `${ladder[key][rightSideProfit] >= 0 ? "green" : 'red'}`}}
            onClick = {handleHedgeCellClick(1)}
          >{unmatchedBetOnRow && unmatchedBetOnRow.side === rightSide ? unmatchedBetOnRow.size : ladder[key][rightSideProfit]}</div>
        </div>
    )
}