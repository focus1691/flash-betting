import React from 'react';
import { connect } from 'react-redux';
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

const LadderRow = ({ data: { selectionId, hedgingAvailable }, PL, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, style, index, layFirstCol, isLTP, ltps }) => {
  const key = ALL_PRICES[ALL_PRICES.length - index - 1];
  const side = getMatchedSide(layFirstCol);

  // gets all the bets and returns a hedge or new pl
  // const hedge = useMemo(() => (hedgingAvailable ? CalculateLadderHedge(key, selectionMatchedBets, ladderUnmatchedDisplay, stakeVal, PL) : undefined), [hedgingAvailable, selectionMatchedBets, key, ladderUnmatchedDisplay, stakeVal, PL]);

  // for the stoploss and tickoffset
  // const HedgeSize = useMemo(() => (hedgingAvailable ? CalculateLadderHedge(key, selectionMatchedBets, 'hedged', stakeVal, PL).size : undefined), [hedgingAvailable, selectionMatchedBets, key, stakeVal, PL]);

  return (
    <div key={`ladder-row-${selectionId}-${key}`} className="tr" style={style}>
      <VolumeCell selectionId={selectionId} price={key} />
      <HedgeCell selectionId={selectionId} price={key} side={side.left} hedgingAvailable={hedgingAvailable} />
      <OrderCell selectionId={selectionId} price={key} side={side.left} />
      <OddsCell selectionId={selectionId} price={key} isLTP={isLTP} ltps={ltps} />
      <OrderCell selectionId={selectionId} price={key} side={side.right} />
      <HedgeCell selectionId={selectionId} price={key} side={side.right} hedgingAvailable={hedgingAvailable} />
    </div>
  );
};

const mapStateToProps = (state, { data: { selectionId }, index }) => ({
  ladderUnmatchedDisplay: state.settings.ladderUnmatched,
  selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  stakeVal: getStakeVal(state.settings.stake, { selectionId }),
  PL: getPL(state.ladder.marketPL, { selectionId }),
  layFirstCol: state.ladder.layFirstCol,
  isLTP: isPriceLastTraded(state.market.ladder, { selectionId, price: ALL_PRICES[ALL_PRICES.length - index - 1] }),
  ltps: getLadderLTPs(state.market.ladder, { selectionId }),
});

export default connect(mapStateToProps)(LadderRow);
