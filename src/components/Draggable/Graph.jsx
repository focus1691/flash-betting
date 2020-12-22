import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
//* Actions
import { openGraph } from '../../actions/draggable';
//* JSS
import useStyles from '../../jss/components/graphStyle';

const DraggableGraph = ({
  marketId, selection, open, openGraph,
}) => {
  const classes = useStyles();
  const [transparent, setTransparent] = useState(false);

  const changeGraphTransparency = () => (e) => {
    setTransparent(!transparent);
  };

  const handleGraphClick = useCallback(() => {
    openGraph();
  }, [openGraph]);

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
        src={`https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selection.selectionId}`}
      />
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  marketId: state.market.marketId,
  selection: state.market.runnerSelection,
  open: state.draggable.graphOpen,
});

const mapDispatchToProps = { openGraph };

export default connect(mapStateToProps, mapDispatchToProps)(DraggableGraph);
