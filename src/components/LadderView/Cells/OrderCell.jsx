import _ from 'lodash';
import React, { useState, memo, useMemo } from 'react';
import { connect } from 'react-redux';
//* Actions
import { processOrder } from '../../../redux/actions/bet';
import { replaceStopLoss } from '../../../redux/actions/stopLoss';
import { setOddsHovered } from '../../../redux/actions/ladder';
//* Selectors
import { getMatched } from '../../../selectors/marketSelector';
import { getStopLoss } from '../../../selectors/stopLossSelector';
import { getTickOffset } from '../../../selectors/tickOffsetSelector';
import { getTotalMatched, orderStyle, textForOrderCell } from '../../../utils/Bets/GetMatched';
import { formatPrice } from '../../../utils/Bets/PriceCalculations';

const OrderCell = ({ selectionId, side, price, marketId, processOrder, stopLoss, stopLossUnits, stopLossHedged, stopLossSelected, tickOffset, hedgeSize, stakeVal, cellMatched, replaceStopLoss }) => {
  const [betPending, setBetPending] = useState(false);
  const totalMatched = useMemo(() => getTotalMatched(betPending, stakeVal[selectionId], cellMatched, null), [betPending, cellMatched, selectionId, stakeVal]);
  const text = useMemo(() => textForOrderCell(stopLoss, totalMatched), [stopLoss, totalMatched]);
  const style = useMemo(() => orderStyle(side, stopLoss, tickOffset, cellMatched, totalMatched, betPending), [side, stopLoss, tickOffset, cellMatched, totalMatched, betPending]);

  const handleClick = async () => {
    if (betPending) return;
    setBetPending(true);
    await processOrder({ side, price, marketId, selectionId, stopLossSelected, isStopLossActive: _.isEmpty(stopLoss), hedgeSize} );
    setBetPending(false);
  };

  const handleRightClick = (e) => {
    e.preventDefault();

    replaceStopLoss(stopLoss, {
      selectionId,
      stakeVal,
      side,
      price: formatPrice(price),
      units: stopLossUnits,
      stopLossHedged,
    });
  };

  const handleMouseEnter = () => {
    setOddsHovered({ selectionId, odds: price, side });
  };

  const handleMouseLeave = () => {
    setOddsHovered({ selectionId, odds: 0, side });
  };

  return (
    <div role="button" tabIndex="0" className="td" style={style} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} onContextMenu={handleRightClick}>
      {text}
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  marketId: state.market.marketId,

  //* SL
  stopLoss: getStopLoss(state.stopLoss.list, props),
  stopLossSelected: state.stopLoss.selected,
  stopLossUnits: state.stopLoss.units,
  stopLossHedged: state.stopLoss.hedged,

  //* TOS
  tickOffset: getTickOffset(state.tickOffset.list, props),

  stakeVal: state.settings.stake,
  cellMatched: getMatched(state.market.ladder, props),
});

const mapDispatchToProps = { processOrder, setOddsHovered, replaceStopLoss };

export default connect(mapStateToProps, mapDispatchToProps)(memo(OrderCell));
