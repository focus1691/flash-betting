import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getUnmatchedBetOnRow, getMatchedBets, getSelectionMatchedBets } from '../../selectors/orderSelector';
import GetQueryVariable from '../../utils/Market/GetQueryVariable';
import { getPLForRunner } from '../../utils/Bets/GetProfitAndLoss';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { getStakeVal } from '../../selectors/settingsSelector';

const LadderHedgeCell = ({marketId, selectionId, price, unmatchedBetOnRow, side, PLHedgeNumber, hedgeSize, handleHedgeCellClick}) => {

    const PLHedgeProfit = PLHedgeNumber && PLHedgeNumber.side === side && PLHedgeNumber.profit ? PLHedgeNumber.profit : undefined

    return (
        <div 
            className = 'td'
            style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === side ? 'black' : `${PLHedgeProfit >= 0 ? "green" : 'red'}`}}
            onClick = {() => handleHedgeCellClick(marketId, selectionId, unmatchedBetOnRow, side, price, parseFloat(PLHedgeProfit) + parseFloat(hedgeSize) )}
        >
            {unmatchedBetOnRow && unmatchedBetOnRow.side === side ? unmatchedBetOnRow.size : PLHedgeProfit }
        </div>
    )
}

const mapStateToProps = (state, {selectionId, price}) => {
    return {
        unmatchedBetOnRow: getUnmatchedBetOnRow(state.order.bets, {selectionId, price}),
    };  
  };

export default connect(mapStateToProps)(memo(LadderHedgeCell))