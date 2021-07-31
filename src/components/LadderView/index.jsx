import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import SuspendedWarning from '../GridView/SuspendedWarning';
import Ladder from './Ladder';
//* JSS
import useStyles from '../../jss/components/LadderView';

const Ladders = ({ marketOpen, marketStatus, ladderOrder, excludedLadders }) => {
  const classes = useStyles();

  const tesss = Object.values(ladderOrder)
    .filter((value) => excludedLadders.indexOf(value) === -1)
    .map((selectionId) => selectionId);

    console.log(tesss);

  return marketOpen && (marketStatus === 'SUSPENDED' || marketStatus === 'OPEN' || marketStatus === 'RUNNING') ? (
    <div
      className={clsx(classes.ladderContainer, {
        [classes.suspendedMarket]: marketStatus === 'SUSPENDED',
      })}
      onContextMenu={(e) => e.preventDefault()}
    >
      {Object.values(ladderOrder)
        .filter((value) => excludedLadders.indexOf(value) === -1)
        .map((selectionId, index) => (
          <Ladder selectionId={selectionId} key={selectionId} order={index} />
        ))}
      <SuspendedWarning marketStatus={marketStatus} />
    </div>
  ) : (
    <div className={classes.closedContainer} />
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketStatus: state.market.status,
  ladderOrder: state.ladder.ladderOrder,
  excludedLadders: state.ladder.excludedLadders,
});

export default connect(mapStateToProps)(Ladders);
