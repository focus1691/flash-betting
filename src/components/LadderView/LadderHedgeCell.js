import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getUnmatchedBetsOnRow } from '../../selectors/orderSelector';

const LadderHedgeCell = ({marketId, selectionId, price, unmatchedBetsOnRow, side, PLHedgeNumber, handleHedgeCellClick}) => {

    let PLHedgeProfit = PLHedgeNumber && PLHedgeNumber.side === side && PLHedgeNumber.profit ? PLHedgeNumber.profit : undefined;
    let unmatchedStake = 0;
    if (unmatchedBetsOnRow) {
        unmatchedStake = unmatchedBetsOnRow.reduce(function (acc, bet) { return acc + bet.size; }, 0);
    }

    return (
        <div 
            className = 'td'
            style = {{color: unmatchedBetsOnRow ? 'black' : `${PLHedgeProfit >= 0 ? "green" : 'red'}`}}
            onClick = {() => {
                if (PLHedgeNumber) {
                    handleHedgeCellClick(marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber.size )
                }
            }}
        >
            {unmatchedBetsOnRow ? unmatchedStake : PLHedgeProfit }
        </div>
    )
}

const mapStateToProps = (state, {selectionId, price, side}) => {
    return {
        unmatchedBetsOnRow: getUnmatchedBetsOnRow(state.order.bets, {selectionId, price, side}),
    };  
};


const isMoving = (prevProps, nextProps) => {
    if (nextProps.isMoving) {
        return true;
    } else {
        return false;
    }
}

export default connect(mapStateToProps)(memo(LadderHedgeCell, isMoving))