import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getIsLTP, getLTPDelta, getLTP } from '../../selectors/marketSelector';
import { formatPrice, formatPriceKey } from '../../utils/ladder/CreateFullLadder';
import { getLTPstyle } from '../../utils/ladder/DeconstructLadder';

const LadderLTPCell = ({price, isLTP, ltp, ltpDelta}) => {
    const ltpStyle = isLTP ? getLTPstyle(ltp, ltpDelta) : {background: "#BBBBBB"};

    return (
        <div style = {ltpStyle} className = 'td'>
            {formatPrice(price)}
        </div>
    )
}

const mapStateToProps = (state, {selectionId, price}) => {
    return {
        isLTP: getIsLTP(state.market.ladder, {selectionId: selectionId, price: formatPriceKey(price)}),
        ltp: getLTP(state.market.ladder, {selectionId}), 
        ltpDelta: getLTPDelta(state.market.ladder, {selectionId}),
    };  
};


const arePropsEqual = (prevProps, nextProps) => {
    if (nextProps.isMoving) {
        return true
    }
    else if (nextProps.isLTP !== prevProps.isLTP || nextProps.ltpDelta !== prevProps.ltpDelta) {
        return false;
    } else {
        return true;
    }
}

export default connect(mapStateToProps)(memo(LadderLTPCell, arePropsEqual))