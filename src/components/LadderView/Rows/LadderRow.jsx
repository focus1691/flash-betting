import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import CalculateLadderHedge from '../../../utils/ladder/CalculateLadderHedge';
import { ALL_PRICES } from '../../../utils/Bets/PriceCalculations';
import HedgeCell from '../Cells/HedgeCell';
import OddsCell from '../Cells/OddsCell';
import OrderCell from '../Cells/OrderCell';
import VolumeCell from '../Cells/VolumeCell';
import { getSelectionMatchedBets } from '../../../selectors/orderSelector';
import { isPriceLastTraded, getLadderLTPs } from '../../../selectors/lastTradedPriceSelector';
import { getStakeVal } from '../../../selectors/settingsSelector';
import { getPL } from '../../../selectors/marketSelector';
import { getMatchedSide } from '../../../utils/Bets/GetMatched';

const LadderRow = ({ data: { selectionId, hedgingAvailable }, PL, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, layFirstCol, price, isLTP, ltps }) => {
  const side = getMatchedSide(layFirstCol);

  // gets all the bets and returns a hedge or new pl
  const hedge = useMemo(() => (hedgingAvailable ? CalculateLadderHedge(price, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, PL) : undefined), [hedgingAvailable, selectionMatchedBets, price, ladderUnmatchedDisplay, stakeVal, PL]);

  return (
    <div key={`ladder-row-${selectionId}-${price}`} className="tr" style={style}>
      <VolumeCell selectionId={selectionId} price={price} />
      <HedgeCell selectionId={selectionId} price={price} side={side.left} hedge={hedge} hedgingAvailable={hedgingAvailable} />
      <OrderCell selectionId={selectionId} price={price} side={side.left} />
      <OddsCell selectionId={selectionId} price={price} isLTP={isLTP} ltps={ltps} />
      <OrderCell selectionId={selectionId} price={price} side={side.right} />
      <HedgeCell selectionId={selectionId} price={price} side={side.right} hedge={hedge} hedgingAvailable={hedgingAvailable} />
    </div>
  );
};

const mapStateToProps = (state, { data: { selectionId }, index }) => ({
  price: ALL_PRICES[ALL_PRICES.length - index - 1],
  ladderUnmatchedDisplay: state.settings.ladderUnmatched,
  selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  stakeVal: getStakeVal(state.settings.stake, { selectionId }),
  PL: getPL(state.ladder.marketPL, { selectionId }),
  layFirstCol: state.ladder.layFirstCol,
  isLTP: isPriceLastTraded(state.market.ladder, { selectionId, price: ALL_PRICES[ALL_PRICES.length - index - 1] }),
  ltps: getLadderLTPs(state.market.ladder, { selectionId }),
});

export default connect(mapStateToProps)(LadderRow);
