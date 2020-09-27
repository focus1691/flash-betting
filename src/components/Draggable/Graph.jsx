import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { openGraph } from '../../actions/draggable';

const DraggableGraph = ({
  market, selection, open, openGraph,
}) => {
  const [transparent, setTransparent] = useState(false);

  const changeGraphTransparency = () => (e) => {
    setTransparent(!transparent);
  };

  const handleGraphClick = useCallback(() => {
    openGraph();
  }, [openGraph]);

  return selection && open ? (
    <div className="popup-graph" style={{ opacity: transparent ? 0.5 : 1 }}>
      <div>
        <span>{selection.runnerName}</span>
        <span className="popup-graph-toggle-transparency" onClick={changeGraphTransparency()}>
          {transparent ? 'Solid' : 'Transparent'}
        </span>
        <img
          alt="Close"
          className="close-popup-graph"
          src={`${window.location.origin}/icons/error.png`}
          onClick={handleGraphClick}
        />
      </div>
      <img
        alt="Chart"
        style={{ pointerEvents: 'none' }}
        src={`https://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=${market.marketId.slice(
          2,
          market.marketId.length,
        )}&selectionId=${selection.selectionId}&handicap=0`}
      />
    </div>
  ) : null;
};

const mapStateToProps = (state) => ({
  market: state.market.currentMarket,
  selection: state.market.runnerSelection,
  open: state.draggable.graphOpen,
});

const mapDispatchToProps = { openGraph };

export default connect(mapStateToProps, mapDispatchToProps)(DraggableGraph);
