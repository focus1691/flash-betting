import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
//* Actions
import { processHedge } from '../../../redux/actions/bet';
//* Utils
import { calcHedgeProfit } from '../../../utils/Bets/HedgeProfit';
//* JSS
import useStyles from '../../../jss/components/LadderView/hedgeCellStyle';

const LadderHedgeCell = ({ selectionId, price, side, hedge, processHedge }) => {
  const classes = useStyles();
  const hedgePL = calcHedgeProfit(hedge, side);

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
      {hedgePL}
    </div>
  );
};

const mapDispatchToProps = { processHedge };

export default connect(null, mapDispatchToProps)(LadderHedgeCell);
