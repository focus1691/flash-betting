import _ from 'lodash';
import React, { memo, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
//* Selectors
import { getUnmatchedBetsOnRow } from '../../../selectors/orderSelector';
//* Utils
import { calcHedgeProfit } from '../../../utils/Bets/HedgeProfit';
import GetUnmatchedStake from '../../../utils/Bets/GetUnmatchedStake';
//* JSS
import useStyles from '../../../jss/components/LadderView/hedgeCellStyle';

const LadderHedgeCell = memo(({ marketId, selectionId, price, unmatchedBetsOnRow, side, hedgingAvailable, PLHedgeNumber, handleHedgeCellClick }) => {
  const classes = useStyles();
  const hedgePL = useMemo(() => calcHedgeProfit(PLHedgeNumber, side), [PLHedgeNumber, side]);
  const unmatchedStake = useMemo(() => GetUnmatchedStake(unmatchedBetsOnRow), [unmatchedBetsOnRow]);
  const text = useMemo(() => (unmatchedStake > 0 ? unmatchedStake : hedgingAvailable ? hedgePL : null), [unmatchedStake, hedgingAvailable, hedgePL]);

  const handleClick = useCallback(() => {
    handleHedgeCellClick(marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber);
  }, [handleHedgeCellClick, marketId, selectionId, unmatchedBetsOnRow, side, price, PLHedgeNumber]);

  return (
    <div
      role="button"
      tabIndex="0"
      className={clsx('td', {
        [classes.profit]: hedgePL >= 0,
        [classes.loss]: hedgePL < 0,
        [classes.breakEven]: !_.isEmpty(unmatchedBetsOnRow),
      })}
      onClick={handleClick}
    >
      {text}
    </div>
  );
});

const mapStateToProps = (state, { selectionId, price, side }) => ({
  marketId: state.market.marketId,
  unmatchedBetsOnRow: getUnmatchedBetsOnRow(state.order.bets, { selectionId, price, side }),
});

export default connect(mapStateToProps)(LadderHedgeCell);
