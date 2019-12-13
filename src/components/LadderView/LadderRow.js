import React, { memo } from 'react';
import { connect } from 'react-redux';
import { setOddsHovered } from '../../actions/market';
import { ALL_PRICES } from "../../utils/ladder/CreateFullLadder";
import LadderHedgeCell from './LadderHedgeCell';
import LadderLTPCell from './LadderLTPCell';
import LadderOrderCell from './LadderOrderCell';
import LadderVolumeCell from './LadderVolumeCell';

const LadderRow = ({data: { selectionId, placeOrder, cancelOrder, ltp, ltpList, stopLoss, changeStopLossList, hedgeSize, ladderSideLeft, selectionUnmatched, marketId, matchedBets, unmatchedBets }, onOddsHovered, vol, style, index}) => {
    const key = ALL_PRICES[ALL_PRICES.length - index - 1]
    
    

    const leftSide = ladderSideLeft === "LAY" ? "LAY" : "BACK"
    const rightSide = ladderSideLeft === "LAY" ? "BACK" : "LAY"

    const handleContextMenu = () => e => {
      e.preventDefault();
      return false;
    };

    console.log('zta')

    return (
        <div key={key}  onContextMenu = {handleContextMenu()} className={"tr"} style = {style} >
          
          <LadderVolumeCell selectionId = {selectionId} price = {key} />
          <LadderHedgeCell selectionId = {selectionId} price = {key} leftSide = {leftSide} />
          
          <LadderOrderCell 
            side = {leftSide}
            selectionId = {selectionId}
            price = {key}
            // ladderSideLeft = {ladderSideLeft}
            // cell = {ladder[key]}
            // selectionId = {selectionId}
            placeOrder = {placeOrder}
            // isStopLoss = {stopLoss !== undefined && stopLoss.side === leftSide ? 
            //               stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
            //               findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
            //                : false}
            // stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
            // hedgeSize = {hedgeSize}
            onHover = {onOddsHovered({selectionId, odds: key, side: leftSide})}
            onLeave = {onOddsHovered({selectionId, odds: 0, side: leftSide})}
          />
          <LadderLTPCell selectionId = {selectionId} price = {key} />
          
          <LadderOrderCell 
            side = {rightSide}
            selectionId = {selectionId}
            price = {key}
            // ladderSideLeft = {ladderSideLeft}
            // cell = {ladder[key]}
            // selectionId = {selectionId}
            placeOrder = {placeOrder} 
            // isStopLoss = {stopLoss !== undefined && stopLoss.side === rightSide ? 
            //   stopLoss.units === "Ticks" ? findStopPosition(stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key :
            //   findStopPositionForPercent(stopLoss.size, stopLoss.price, stopLoss.tickOffset, stopLoss.side.toLowerCase()) === key
            //    : false}
            // stopLossData = {stopLoss}
            changeStopLossList= {changeStopLossList}
            // hedgeSize = {hedgeSize}
            onHover = {onOddsHovered({selectionId, odds: key, side: rightSide})}
            onLeave = {onOddsHovered({selectionId, odds: 0, side: rightSide})}
          />
          <div 
            className = 'td'
            // style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === rightSide ? 'black' : `${ladder[key][rightSideProfit] >= 0 ? "green" : 'red'}`}}
            // onClick = {handleHedgeCellClick(1)}
          >{}</div>
        </div>
    )
}

const mapStateToProps = (state, {data: {selectionId}, index}) => {
  return {
      
      
      
  };  
};

const mapDispatchToProps = dispatch => {
  return {
      onOddsHovered: odds => e => dispatch(setOddsHovered(odds))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(memo(LadderRow));