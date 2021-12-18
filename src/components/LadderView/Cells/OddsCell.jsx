import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getIsLTP, getLTP } from '../../../selectors/marketSelector';
import { formatPrice, formatPriceKey } from '../../../utils/Bets/PriceCalculations';
import { getLTPstyle } from '../../../utils/ladder/DeconstructLadder';

const LTPCell = ({ price, isLTP, ltp }) => {
  const ltpStyle = isLTP ? getLTPstyle(ltp) : { background: '#333f4b' };

  return (
    <div style={ltpStyle} className="td">
      {formatPrice(price)}
    </div>
  );
};

const mapStateToProps = (state, { selectionId, price }) => ({
  isLTP: getIsLTP(state.market.ladder, { selectionId, price: formatPriceKey(price) }),
  ltp: getLTP(state.market.ladder, { selectionId }),
});

export default connect(mapStateToProps)(memo(LTPCell));
