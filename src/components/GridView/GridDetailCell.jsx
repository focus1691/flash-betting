import crypto from 'crypto';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
//* Actions
import { setRunner } from '../../actions/market';
import { placeOrder } from '../../actions/bet';
import { calcBackProfit } from '../../utils/Bets/BettingCalculations';
import { selectionHasBets } from '../../utils/Bets/SelectionHasBets';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { iconForEvent } from '../../utils/Market/EventIcons';
import { isHedgingOnSelectionAvailable } from '../../utils/TradingStategy/HedingCalculator';
import { getSelectionMatchedBets } from '../../selectors/orderSelector';
//* JSS
import useStyles from '../../jss/components/GridView/GridDetailCell';

const GridDetailCell = ({
  selectionMatchedBets, setRunner, placeOrder, sportId, marketId, runner, name, number, logo, ltp, tv, PL, hedge, ltpStyle,
}) => {
  const classes = useStyles();
  const side = useMemo(() => (selectionMatchedBets.reduce((a, b) => a + calcBackProfit(b.size, b.price, b.side), 0) <= 0 ? 'BACK' : 'LAY'), [selectionMatchedBets]);

  const handleImageError = () => (e) => {
    e.target.onerror = null;
    e.target.src = iconForEvent(Number(sportId));
  };

  const executeHedgeBet = () => () => {
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
      });
    }
  };

  const handleRunnerSelection = useCallback(() => {
    setRunner(runner);
  }, [runner]);

  return (
    <td className={classes.gridRunnerDetails} onClick={handleRunnerSelection}>
      <img src={logo} alt="" onError={handleImageError()} />
      <span>{`${number}${name}`}</span>
      <span style={ltpStyle} className={classes.ltp}>{ltp[0] || ''}</span>

      <div className={classes.gridPL}>
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
