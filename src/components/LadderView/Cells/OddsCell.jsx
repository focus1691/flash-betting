import React, { memo } from 'react';
import { connect } from 'react-redux';
import { getIsLTP, getLTPDelta, getLTP } from '../../../selectors/marketSelector';
import { formatPrice, formatPriceKey } from '../../../utils/Bets/PriceCalculations';
import { getLTPstyle } from '../../../utils/ladder/DeconstructLadder';

const arePropsEqual = (prevProps, nextProps) => {
  if (nextProps.isMoving) return true;
  if (nextProps.isLTP !== prevProps.isLTP || nextProps.ltpDelta !== prevProps.ltpDelta) return false;
  return true;
};

const LTPCell = memo(({ price, isLTP, ltp, ltpDelta }) => {
  const ltpStyle = isLTP ? getLTPstyle(ltp, ltpDelta) : { background: '#333f4b' };

  return (
    <div style={ltpStyle} className="td">
      {formatPrice(price)}
    </div>
  );
}, arePropsEqual);

const mapStateToProps = (state, { selectionId, price }) => ({
  isLTP: getIsLTP(state.market.ladder, { selectionId, price: formatPriceKey(price) }),
  ltp: getLTP(state.market.ladder, { selectionId }),
  ltpDelta: getLTPDelta(state.market.ladder, { selectionId }),
});

export default connect(mapStateToProps)(LTPCell);
