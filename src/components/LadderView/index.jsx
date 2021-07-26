import React, { useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { setSortedLadder } from '../../redux/actions/market';
import { updateLadderOrder } from '../../redux/actions/ladder';
import { sortLadders } from '../../utils/ladder/SortLadder';
import SuspendedWarning from '../GridView/SuspendedWarning';
import Ladder from './Ladder';
//* JSS
import useStyles from '../../jss/components/LadderView';

const Ladders = ({ eventTypeId, ladders, ladderOrder, sortedLadder, updateLadderOrder, marketOpen, marketStatus, setSortedLadder, excludedLadders }) => {
  const classes = useStyles();
  //* Sort ladder on market open, excluding ladders are first 6
  useEffect(() => {
    sortLadders(eventTypeId, ladders, sortedLadder, updateLadderOrder, setSortedLadder, null, false);
  }, [Object.keys(ladders).length > 0]);

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
  sortedLadder: state.market.sortedLadder,
  ladderOrder: state.ladder.ladderOrder,
  excludedLadders: state.ladder.excludedLadders,
  eventTypeId: state.market.eventType.id,
  ladders: state.market.ladder,
});

const mapDispatchToProps = { updateLadderOrder, setSortedLadder };

export default connect(mapStateToProps, mapDispatchToProps)(Ladders);
