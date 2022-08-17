import clsx from 'clsx';
import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
//* Actions
import { addStopLoss } from '../../redux/actions/stopLoss';
import { addTickOffset } from '../../redux/actions/tickOffset';
import { addFillOrKill } from '../../redux/actions/fillOrKill';
import { placeOrder } from '../../redux/actions/bet';
import { getLadderLTPs } from '../../selectors/lastTradedPriceSelector';
import { getSelectionMatchedBets } from '../../selectors/orderSelector';
//* Utils
import { getStakeVal } from '../../selectors/settingsSelector';
import { ALL_PRICES } from '../../utils/Bets/PriceCalculations';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
//* Components
import Container from './Container';
import Header from './Header';
import BottomPanel from './BottomPanel';
import LadderRow from './Rows/LadderRow';
import PercentageRow from './Rows/PercentageRow/PercentageRow';
import PriceRow from './Rows/PriceRow';
//* JSS
import useStyles from '../../jss/components/LadderView/ladderStyle';

const Ladder = ({ selectionId, ltps, expanded, order, selectionMatchedBets, setLadderSideLeft, draggingLadder }) => {
  const classes = useStyles();
  const containerRef = useRef(null);
  const listRef = useRef();
  const [listRefSet, setlistRefSet] = useState(false);
  const [isReferenceSet, setIsReferenceSet] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isLadderDown, setLadderDown] = useState(false);
  const [ladderLocked, setLadderLocked] = useState(false);
  const [ladderLastHovered, setLadderLastHovered] = useState(Date.now());

  const ladderStyle = useMemo(() => (listRefSet ? { paddingRight: `${listRef.current.offsetWidth - listRef.current.clientWidth - 17}px` } : ''), [listRefSet]);
  const ltpHedge = useMemo(() => CalculateLadderHedge(ltps, selectionMatchedBets, 'hedged'), [ltps, selectionMatchedBets]);
  const hedgingAvailable = useMemo(() => ltpHedge && ltpHedge.size >= 0.01, [ltpHedge]);

  const setReferenceSent = () => {
    setIsReferenceSet(true);
  };

  const onHoverLadder = () => {
    if (!ladderLocked) {
      setLadderLocked(true);
      setLadderLastHovered(Date.now());
    }
  };

  const overLeaveLadder = () => {
    if (ladderLocked && Date.now() - ladderLastHovered > 100) {
      setLadderLocked(false);
    }
  };

  const scrollToLTP = useCallback(() => {
    const ltpIndex = ALL_PRICES.findIndex((item) => parseFloat(item) === parseFloat(ltps[0]));
    if (listRef.current !== null && listRef.current !== undefined && ltpIndex !== -1) {
      // we do the calculation because we start in reverse
      listRef.current.scrollToItem(ALL_PRICES.length - 1 - ltpIndex, 'center');
      setlistRefSet(true);
    }
  }, [ltps]);

  //* Scroll to the LTP when the ladder first loads
  useEffect(() => {
    setTimeout(() => {
      scrollToLTP();
    }, 1000);
  }, []);

  //* Scroll to the LTP when the ladder order changes
  useEffect(() => {
    if (!ladderLocked) scrollToLTP();
  }, [ltps, draggingLadder, scrollToLTP, ladderLocked]);

  return (
    <Container isReferenceSet={isReferenceSet} order={order} containerRef={containerRef} isMoving={isMoving} isLadderDown={isLadderDown} setIsReferenceSet={setReferenceSent} setIsMoving={setIsMoving} setLadderDown={setLadderDown}>
      <Header selectionId={selectionId} setLadderDown={setLadderDown} hedge={ltpHedge} />

      <div
        className={clsx(classes.ladder, {
          [classes.expanded]: expanded,
        })}
        onContextMenu={() => false}
        onPointerOver={onHoverLadder}
        onPointerLeave={overLeaveLadder}
      >
        <PercentageRow setLadderSideLeft={setLadderSideLeft} selectionId={selectionId} />
        <AutoSizer>
          {({ height, width }) => (
            <List
              className={classes.List}
              height={height}
              itemCount={ALL_PRICES.length}
              itemSize={20}
              width={width}
              ref={listRef}
              style={ladderStyle}
              itemData={{
                selectionId,
                hedgingAvailable,
              }}
            >
              {LadderRow}
            </List>
          )}
        </AutoSizer>
      </div>
      <PriceRow selectionId={selectionId} />
      <BottomPanel selectionId={selectionId} />
    </Container>
  );
};

const mapStateToProps = (state, { selectionId }) => ({
  ltps: getLadderLTPs(state.market.ladder, { selectionId }),
  expanded: state.market.ladder[selectionId].expanded,
  selectionMatchedBets: getSelectionMatchedBets(state.order.bets, { selectionId }),
  stakeVal: getStakeVal(state.settings.stake, { selectionId }),
  customStake: state.market.runners[selectionId].order.customStake,
  draggingLadder: state.ladder.draggingLadder,
});

const mapDispatchToProps = { placeOrder, addStopLoss, addTickOffset, addFillOrKill };

export default connect(mapStateToProps, mapDispatchToProps)(Ladder);
