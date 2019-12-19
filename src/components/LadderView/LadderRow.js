import React, { memo } from 'react';
import { connect } from 'react-redux';
import { setOddsHovered } from '../../actions/market';
import { ALL_PRICES } from "../../utils/ladder/CreateFullLadder";
import LadderHedgeCell from './LadderHedgeCell';
import LadderLTPCell from './LadderLTPCell';
import LadderOrderCell from './LadderOrderCell';
import LadderVolumeCell from './LadderVolumeCell';
import GetQueryVariable from '../../utils/Market/GetQueryVariable';
import { getPLForRunner } from '../../utils/Bets/GetProfitAndLoss';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { getSelectionMatchedBets, getMatchedBets } from '../../selectors/orderSelector';
import { getStakeVal } from '../../selectors/settingsSelector';

const LadderRow = ({data: { selectionId, placeOrder, ladderSideLeft, handleHedgeCellClick, changeStopLossList }, 
                    onOddsHovered, matchedBets, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, index}) => {
    const key = ALL_PRICES[ALL_PRICES.length - index - 1];
    
    const leftSide = ladderSideLeft === "LAY" ? "LAY" : "BACK";
    const rightSide = ladderSideLeft === "LAY" ? "BACK" : "LAY";

    const handleContextMenu = () => e => {
      e.preventDefault();
      return false;
    };

    const marketId = GetQueryVariable("marketId");
    
    const PL = matchedBets !== undefined ? getPLForRunner(marketId, parseInt(selectionId), { matched: matchedBets }).toFixed(2) : 0;

    const PLHedgeNumber = selectionMatchedBets.length > 0 ? CalculateLadderHedge(key, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, PL) : undefined; 

    // gets all the bets we made and creates a size to offset
    const hedgeSize = selectionMatchedBets !== undefined ?
        selectionMatchedBets.reduce((a, b) => {
            return a + b.size;
        }, 0) : 0;
    
    return (
        <div key={key}  onContextMenu = {handleContextMenu()} className={"tr"} style = {style} >
          
          <LadderVolumeCell selectionId = {selectionId} price = {key} />
          <LadderHedgeCell selectionId = {selectionId} price = {key} PLHedgeNumber = {PLHedgeNumber} hedgeSize = {hedgeSize} side = {leftSide} handleHedgeCellClick = {handleHedgeCellClick} />
          
          <LadderOrderCell 
            side = {leftSide}
            selectionId = {selectionId}
            price = {key}
            placeOrder = {placeOrder}
            changeStopLossList= {changeStopLossList}
            hedgeSize = {hedgeSize}
            onHover = {onOddsHovered({selectionId, odds: key, side: leftSide})}
            onLeave = {onOddsHovered({selectionId, odds: 0, side: leftSide})}
          />
          <LadderLTPCell selectionId = {selectionId} price = {key} />
          
          <LadderOrderCell 
            side = {rightSide}
            selectionId = {selectionId}
            price = {key}
            placeOrder = {placeOrder} 
            changeStopLossList= {changeStopLossList}
            hedgeSize = {hedgeSize}
            onHover = {onOddsHovered({selectionId, odds: key, side: rightSide})}
            onLeave = {onOddsHovered({selectionId, odds: 0, side: rightSide})}
          />

          <LadderHedgeCell selectionId = {selectionId} price = {key} side = {rightSide} PLHedgeNumber = {PLHedgeNumber} hedgeSize = {hedgeSize} handleHedgeCellClick = {handleHedgeCellClick}  />
        </div>
    )
}

const mapStateToProps = (state, {data: {selectionId}, index}) => {
  return {
    matchedBets: getMatchedBets(state.order.bets),
    ladderUnmatchedDisplay: state.settings.ladderUnmatched,
    selectionMatchedBets: getSelectionMatchedBets(state.order.bets, {selectionId}),
    stakeVal: getStakeVal(state.settings.stake, {selectionId}),
  };  
};

const mapDispatchToProps = dispatch => {
  return {
      onOddsHovered: odds => e => dispatch(setOddsHovered(odds))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(memo(LadderRow));