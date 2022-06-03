import React, { useState } from 'react';
import { connect } from 'react-redux';
import { openGraph } from '../../../redux/actions/draggable';
import useInterval from '../../../hooks/useInterval';
import useStyles from '../../../jss/components/Sidebar/market/graphStyle';
import { FIVE_SECONDS } from '../../../constants';

const Graph = ({ marketOpen, marketId, selection, openGraph }) => {
  const classes = useStyles();
  const [graph, setGraph] = useState(null);

  useInterval(() => {
    if (marketOpen && selection) {
      setGraph(`https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selection.selectionId}`);
    }
  }, FIVE_SECONDS);

  return (
    <div className={classes.graph}>
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
