import React from 'react';
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
import { getPL } from '../../selectors/marketSelector';

const LadderRow = ({data: { selectionId, placeOrder, ladderSideLeft, handleHedgeCellClick, changeStopLossList }, 
                    PL, onOddsHovered, matchedBets, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, index}) => {
    const key = ALL_PRICES[ALL_PRICES.length - index - 1];
    
    const leftSide = ladderSideLeft === "LAY" ? "LAY" : "BACK";
    const rightSide = ladderSideLeft === "LAY" ? "BACK" : "LAY";

    const handleContextMenu = () => e => {
      e.preventDefault();
      return false;
    };

    const marketId = GetQueryVariable("marketId");

    // gets all the bets and returns a hedge or new pl
    const PLHedgeNumber = selectionMatchedBets.length > 0 ? CalculateLadderHedge(key, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, PL) : undefined;

    // for the stoploss and tickoffset 
    const HedgeSize = selectionMatchedBets.length > 0 ? CalculateLadderHedge(key, selectionMatchedBets, 'hedged', stakeVal, PL).size : undefined; 
    
    return (
        <div key={key}  onContextMenu = {handleContextMenu()} className={"tr"} style = {style} >
          
          <LadderVolumeCell selectionId = {selectionId} price = {key} />
          <LadderHedgeCell 
            marketId = {marketId} 
            selectionId = {selectionId} 
            price = {key} 
            PLHedgeNumber = {PLHedgeNumber} 
            side = {leftSide} 
            handleHedgeCellClick = {handleHedgeCellClick} 
          />
          <LadderOrderCell 
            side = {leftSide}
            selectionId = {selectionId}
            price = {key}
            placeOrder = {placeOrder}
            changeStopLossList= {changeStopLossList}
            // we do this because we want the hedge, not the pl
            hedgeSize = {HedgeSize}
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
            // we do this because we want the hedge, not the pl
            hedgeSize = {HedgeSize}
            onHover = {onOddsHovered({selectionId, odds: key, side: rightSide})}
            onLeave = {onOddsHovered({selectionId, odds: 0, side: rightSide})}
          />
          <LadderHedgeCell 
            marketId = {marketId}
            selectionId = {selectionId} 
            price = {key} 
            side = {rightSide} 
            PLHedgeNumber = {PLHedgeNumber} 
            handleHedgeCellClick = {handleHedgeCellClick}  
          />
        </div>
    )
}

const mapStateToProps = (state, {data: {selectionId}, index}) => {
  return {
    matchedBets: getMatchedBets(state.order.bets),
    ladderUnmatchedDisplay: state.settings.ladderUnmatched,
    selectionMatchedBets: getSelectionMatchedBets(state.order.bets, {selectionId}),
    stakeVal: getStakeVal(state.settings.stake, {selectionId}),
    PL: getPL(state.market.marketPL, {selectionId})
  };  
};

const mapDispatchToProps = dispatch => {
  return {
    onOddsHovered: odds => e => dispatch(setOddsHovered(odds))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(LadderRow);