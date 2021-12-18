import crypto from 'crypto';
import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
//* Actions
import { setRunner } from '../../redux/actions/market';
import { placeOrder } from '../../redux/actions/bet';
import { calcBackProfit } from '../../utils/Bets/BettingCalculations';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
import { iconForEvent } from '../../utils/Market/EventIcons';
import { getSelectionMatchedBets } from '../../selectors/orderSelector';
//* JSS
import useStyles from '../../jss/components/GridView/GridDetailCell';

const GridDetailCell = ({ selectionMatchedBets, setRunner, placeOrder, sportId, marketId, runner, name, number, logo, ltp, tv, PL, ltpStyle }) => {
  const classes = useStyles();
  const hedge = useMemo(() => CalculateLadderHedge(ltp, selectionMatchedBets, 'hedged'), [ltp, selectionMatchedBets]);
  const hedgingAvailable = useMemo(() => hedge && hedge.size >= 0.01, [hedge]);

  const handleImageError = () => (e) => {
    e.target.onerror = null;
    e.target.src = iconForEvent(Number(sportId));
  };

  const executeHedgeBet = useCallback(() => {
    if (hedgingAvailable) {
      const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
      const order = {
        marketId,
        side: hedge.side,
        size: hedge.size,
        price: hedge.price,
        selectionId: runner.selectionId,
        customerStrategyRef,
      }

      placeOrder(order);
    }
  }, [hedgingAvailable, marketId, hedge.side, hedge.size, hedge.price, runner.selectionId]);

  return (
    <td className={classes.gridRunnerDetails} onClick={() => setRunner(runner)}>
      <img src={logo} alt="" onError={handleImageError()} />
      <span>{`${number}${name}`}</span>
      <span style={ltpStyle} className={classes.ltp}>
        {ltp[0] || ''}
      </span>

      <div className={classes.gridPL}>
        <span
          role="button"
          tabIndex="0"
          style={{
            color: !hedgingAvailable ? '#D3D3D3' : hedge.profit < 0 ? 'red' : '#01CC41',
          }}
          onClick={executeHedgeBet}
        >
          {hedgingAvailable ? hedge.profit : null}
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
