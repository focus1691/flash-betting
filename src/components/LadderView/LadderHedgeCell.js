import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getUnmatchedBetOnRow } from '../../selectors/orderSelector';

const LadderHedgeCell = ({marketId, selectionId, price, unmatchedBetOnRow, side, PLHedgeNumber, handleHedgeCellClick}) => {

    const PLHedgeProfit = PLHedgeNumber && PLHedgeNumber.side === side && PLHedgeNumber.profit ? PLHedgeNumber.profit : undefined

    return (
        <div 
            className = 'td'
            style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === side ? 'black' : `${PLHedgeProfit >= 0 ? "green" : 'red'}`}}
            onClick = {() => handleHedgeCellClick(marketId, selectionId, unmatchedBetOnRow, side, price, PLHedgeNumber.size )}
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