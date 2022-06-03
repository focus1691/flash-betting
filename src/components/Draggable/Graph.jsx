import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { openGraph } from '../../redux/actions/draggable';
import useInterval from '../../hooks/useInterval';
import useStyles from '../../jss/components/graphStyle';
import { FIVE_SECONDS } from '../../constants';

const DraggableGraph = ({
  marketOpen, marketId, selection, open, openGraph,
}) => {
  const classes = useStyles();
  const [transparent, setTransparent] = useState(false);
  const [graph, setGraph] = useState(null);

  const changeGraphTransparency = () => () => {
    setTransparent(!transparent);
  };

  const handleGraphClick = useCallback(() => {
    openGraph();
  }, [openGraph]);

  useInterval(() => {
    if (marketOpen && selection) {
      setGraph(`https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selection.selectionId}`);
    }
  }, FIVE_SECONDS);

  return selection && open ? (
    <div className={classes.graph} style={{ opacity: transparent ? 0.5 : 1 }}>
      <div>
        <span>{selection.runnerName}</span>
        <span role="button" tabIndex="0" className={classes.toggleButton} onClick={changeGraphTransparency()}>
          {transparent ? 'Solid' : 'Transparent'}
        </span>
        <img
          alt="Close"
          className={classes.closeButton}
          src={`${window.location.origin}/icons/X_Button.svg`}
          onClick={handleGraphClick}
        />
      </div>
      <img
        alt="Chart"
        style={{ pointerEvents: 'none' }}
        src={graph}
      />
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
  selection: state.market.runnerSelection,
  open: state.draggable.graphOpen,
});

const mapDispatchToProps = { openGraph };

export default connect(mapStateToProps, mapDispatchToProps)(DraggableGraph);
