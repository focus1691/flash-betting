import React, { memo, useMemo } from 'react';
import { connect } from 'react-redux';
import { ALL_PRICES } from '../../../utils/Bets/PriceCalculations';
import HedgeCell from '../Cells/HedgeCell';
import OddsCell from '../Cells/OddsCell';
import OrderCell from '../Cells/OrderCell';
import VolumeCell from '../Cells/VolumeCell';
import CalculateLadderHedge from '../../../utils/ladder/CalculateLadderHedge';
import { getSelectionMatchedBets } from '../../../selectors/orderSelector';
import { getStakeVal } from '../../../selectors/settingsSelector';
import { getPL } from '../../../selectors/marketSelector';
import { getMatchedSide } from '../../../utils/Bets/GetMatched';

const LadderRow = memo(({ data: { selectionId, hedgingAvailable, handlePlaceOrder }, PL, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, index, layFirstCol }) => {
  const key = useMemo(() => ALL_PRICES[ALL_PRICES.length - index - 1], [index]);
  const side = useMemo(() => getMatchedSide(layFirstCol), [layFirstCol]);

  // gets all the bets and returns a hedge or new pl
  const hedge = useMemo(() => (selectionMatchedBets.length > 0 ? CalculateLadderHedge(key, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, PL) : undefined), [selectionMatchedBets, key, ladderUnmatchedDisplay, stakeVal, PL]);

  // for the stoploss and tickoffset
  const HedgeSize = useMemo(() => (selectionMatchedBets.length > 0 ? CalculateLadderHedge(key, selectionMatchedBets, 'hedged', stakeVal, PL).size : undefined), [selectionMatchedBets, key, stakeVal, PL]);

  return (
    <div key={`ladder-row-${selectionId}-${key}`} style={style}>
      <VolumeCell selectionId={selectionId} price={key} />
      <HedgeCell selectionId={selectionId} price={key} side={side.left} hedge={hedge} hedgingAvailable={hedgingAvailable} />
      <OrderCell selectionId={selectionId} price={key} side={side.left} handlePlaceOrder={handlePlaceOrder} hedgeSize={HedgeSize} />
      <OddsCell selectionId={selectionId} price={key} />
      <OrderCell selectionId={selectionId} price={key} side={side.right} handlePlaceOrder={handlePlaceOrder} hedgeSize={HedgeSize} />
      <HedgeCell selectionId={selectionId} price={key} side={side.right} hedgingAvailable={hedgingAvailable} hedge={hedge} />
    </div>
  );
});

const mapStateToProps = (state, { data: { selectionId } }) => ({
  ladderUnmatchedDisplay: state.settings.ladderUnmatched,
  selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  stakeVal: getStakeVal(state.settings.stake, { selectionId }),
  PL: getPL(state.ladder.marketPL, { selectionId }),
  layFirstCol: state.ladder.layFirstCol,
});

export default connect(mapStateToProps)(LadderRow);
