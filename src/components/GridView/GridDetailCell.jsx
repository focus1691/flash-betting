import crypto from 'crypto';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { setRunner } from '../../actions/market';
import { placeOrder } from '../../actions/bet';
import { calcBackProfit } from '../../utils/Bets/BettingCalculations';
import { selectionHasBets } from '../../utils/Bets/SelectionHasBets';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { iconForEvent } from '../../utils/Market/EventIcons';
import { isHedgingOnSelectionAvailable } from '../../utils/TradingStategy/HedingCalculator';
import { getSelectionMatchedBets } from '../../selectors/orderSelector';

const GridDetailCell = ({
  selectionMatchedBets, setRunner, placeOrder, sportId, marketId, runner, name, number, logo, ltp, tv, bets, PL, hedge, ltpStyle,
}) => {
  const side = useMemo(() => (selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side === 'BACK' ? 0 : 1), 0) <= 0 ? 'BACK' : 'LAY'), [selectionMatchedBets]);

  const handleImageError = () => (e) => {
    e.target.onerror = null;
    e.target.src = iconForEvent(parseInt(sportId));
  };

  const executeHedgeBet = () => (e) => {
    if (isHedgingOnSelectionAvailable(selectionMatchedBets)) {
      const referenceStrategyId = crypto
        .randomBytes(15)
        .toString('hex')
        .substring(0, 15);
      const hedgeSize = selectionMatchedBets.length > 0
        ? CalculateLadderHedge(ltp[0], selectionMatchedBets, 'hedged').size
        : undefined;

      placeOrder({
        marketId,
        side,
        size: hedgeSize,
        price: ltp[0],
        selectionId: runner.selectionId,
        customerStrategyRef: referenceStrategyId,
        unmatchedBets: bets.unmatched,
        matchedBets: bets.matched,
      });
    }
  };

  const handleRunnerSelection = useCallback(() => {
    setRunner(runner);
  }, [runner]);

  return (
    <td className="grid-runner-details" onClick={handleRunnerSelection}>
      <img src={logo} alt="" onError={handleImageError()} />
      <span>{`${number}${name}`}</span>
      <span style={ltpStyle}>{ltp[0] || ''}</span>

      <div className="grid-pl">
        <span
          style={{
					  color: !isHedgingOnSelectionAvailable(selectionMatchedBets)
					    ? '#D3D3D3'
					    : hedge < 0
					      ? 'red'
					      : '#01CC41',
          }}
          onClick={executeHedgeBet()}
        >
          {selectionHasBets(selectionMatchedBets) ? hedge : ''}
        </span>
        <span style={{ color: PL.color }}>{PL.val}</span>
        <span>{tv[0] ? Math.floor(tv[0]).toLocaleString() : ''}</span>
      </div>
    </td>
  );
};

const mapStateToProps = (state, { runner: { selectionId } }) => ({
  selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
});

const mapDispatchToProps = { setRunner, placeOrder };

export default connect(mapStateToProps, mapDispatchToProps)(GridDetailCell);
