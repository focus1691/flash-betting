import _, { set } from 'lodash';
import React, { useState, useEffect, memo, useMemo } from 'react';
import { connect } from 'react-redux';
//* Actions
import { removeMatchedAmount } from '../../../redux/actions/market';
import { processOrder } from '../../../redux/actions/bet';
import { replaceStopLoss } from '../../../redux/actions/stopLoss';
import { setOddsHovered } from '../../../redux/actions/ladder';
//* Selectors
import { getUnmatched, getMatched } from '../../../selectors/marketSelector';
import { getStopLoss } from '../../../selectors/stopLossSelector';
import { getTickOffset } from '../../../selectors/tickOffsetSelector';
import { getTotalMatched, orderStyle, textForOrderCell } from '../../../utils/Bets/GetMatched';
import { formatPrice } from '../../../utils/Bets/PriceCalculations';

const OrderCell = ({ selectionId, side, price, marketId, cellMatched, cellUnmatched, processOrder, stopLoss, stopLossUnits, stopLossHedged, stopLossSelected, tickOffset, hedgeSize, stakeVal, replaceStopLoss, removeMatchedAmount }) => {
  const [betPending, setBetPending] = useState(false);
  const [justMatched, setJustMatched] = useState(false)
  const totalMatched = useMemo(() => getTotalMatched(betPending, stakeVal[selectionId], cellUnmatched, null), [betPending, cellUnmatched, selectionId, stakeVal]);
  const text = useMemo(() => textForOrderCell(cellMatched, stopLoss, totalMatched), [cellMatched, stopLoss, totalMatched]);
  const style = useMemo(() => orderStyle(side, stopLoss, tickOffset, cellMatched, cellUnmatched, totalMatched, betPending), [side, stopLoss, tickOffset, cellUnmatched, totalMatched, betPending]);

  useEffect(() => {
    if (!justMatched && cellMatched) {
      setJustMatched(true);
      setTimeout(() => {
        setJustMatched(false);
        removeMatchedAmount(selectionId);
      }, 250);
    }
  }, [cellMatched, justMatched, selectionId]);

  const handleClick = async () => {
    if (betPending) return;
    setBetPending(true);
    await processOrder({ side, price, marketId, selectionId, stopLossSelected, isStopLossActive: _.isEmpty(stopLoss), hedgeSize });
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
  cellUnmatched: getUnmatched(state.market.ladder, props),
  cellMatched: getMatched(state.market.ladder, props),
});

const mapDispatchToProps = { processOrder, setOddsHovered, replaceStopLoss, removeMatchedAmount };

export default connect(mapStateToProps, mapDispatchToProps)(memo(OrderCell));
