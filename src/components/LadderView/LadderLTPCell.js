import React, {memo} from 'react'
import { connect } from 'react-redux'
import { getIsLTP } from '../../selectors/marketSelector';
import { formatPriceKey, ALL_PRICES, formatPrice } from '../../utils/ladder/CreateFullLadder';

const LadderLTPCell = ({selectionId, price, isLTP}) => {
    return (
        <div style = {{
            background: isLTP ? 'yellow' : '#BBBBBB'
        }} className = 'td'>{formatPrice(price)}</div>
    )
}

const mapStateToProps = (state, {selectionId, price}) => {
    return {
        isLTP: getIsLTP(state.market.ladder, {selectionId: selectionId, price: formatPriceKey(price)}),
        
    };  
  };

export default connect(mapStateToProps)(memo(LadderLTPCell))