import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { openGraph } from '../../../actions/draggable';

const Graph = ({ marketOpen, marketId, selection, openGraph }) => {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    if (marketOpen && selection) {
      const URI = `https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selection.selectionId}`;
      setGraph(URI);
    }
  }, [selection, marketId, marketOpen]);

  return (
    <div id="menu-graph">
      {graph ? <img alt="Chart" src={graph} onDoubleClick={openGraph} /> : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
  selection: state.market.runnerSelection,
});

const mapDispatchToProps = { openGraph };

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
