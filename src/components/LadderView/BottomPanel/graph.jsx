import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
//* Hooks
import useInterval from '../../../hooks/useInterval';
//* constants
import { FIVE_SECONDS } from '../../../constants';

const Graph = ({ marketId, selectionId }) => {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const URI = `https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selectionId}`;
    setGraph(URI);
  }, []);

  useInterval(() => {
    console.log('graph');
    const URI = `https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selectionId}`;
    setGraph(URI);
  }, FIVE_SECONDS);

  return graph ? <img alt="Chart" src={graph} /> : null;
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
});

export default connect(mapStateToProps)(Graph);
