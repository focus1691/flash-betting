import React, { memo, useMemo } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
//* Actions
import { processHedge } from '../../../redux/actions/bet';
//* Utils
import { calcHedgeProfit } from '../../../utils/Bets/HedgeProfit';
import GetUnmatchedStake from '../../../utils/Bets/GetUnmatchedStake';
//* JSS
import useStyles from '../../../jss/components/LadderView/hedgeCellStyle';

const LadderHedgeCell = memo(({ selectionId, price, unmatchedBets, side, hedgingAvailable, hedge, processHedge }) => {
  const classes = useStyles();
  const hedgePL = calcHedgeProfit(hedge, side);
  const unmatchedStake = useMemo(() => GetUnmatchedStake(unmatchedBets), [unmatchedBets]);
  const text = unmatchedStake > 0 ? unmatchedStake : hedgingAvailable ? hedgePL : null;

  return (
    <div
      role="button"
      tabIndex="0"
      className={clsx('td', {
        [classes.profit]: hedgePL >= 0,
        [classes.loss]: hedgePL < 0,
        [classes.breakEven]: hedge && hedgePL === 0,
      })}
      onClick={() => processHedge({ selectionId, price, side, hedge })}
    >
      {text}
    </div>
  );
});

const mapDispatchToProps = { processHedge };

export default connect(null, mapDispatchToProps)(LadderHedgeCell);
