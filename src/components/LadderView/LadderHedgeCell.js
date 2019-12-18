import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getUnmatchedBetOnRow } from '../../selectors/orderSelector';

const LadderHedgeCell = ({selectionId, price, unmatchedBetOnRow, leftSide}) => {
    return (
        <div 
            className = 'td'
            // style = {{color: unmatchedBetOnRow && unmatchedBetOnRow.side === leftSide ? 'black' : `${ladder[key][leftSideProfit] >= 0 ? "green" : 'red'}`}}
            // onClick = {handleHedgeCellClick(0)}
        >
              {unmatchedBetOnRow && unmatchedBetOnRow.side === leftSide ? unmatchedBetOnRow.size : false} {/* ladder[key][leftSideProfit] */}
        </div>
    )
}

const mapStateToProps = (state, {selectionId, price}) => {
    return {
        unmatchedBetOnRow: getUnmatchedBetOnRow(state.order.bets, {selectionId, price})
        
    };  
  };

export default connect(mapStateToProps)(memo(LadderHedgeCell))