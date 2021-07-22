import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
//* Hooks
import useInterval from '../../../hooks/useInterval';
//* constants
import { FIVE_SECONDS } from '../../../constants';
//* Styles
import useStyles from '../../../jss/components/LadderView/BottomContainer/graphStyle';

const Graph = ({ marketId, selectionId }) => {
  const styles = useStyles();
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    setGraph(`https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selectionId}`);
  }, []);

  useInterval(() => {
    setGraph(`https://xtsd.betfair.com/LoadRunnerInfoChartAction/?marketId=${marketId}&selectionId=${selectionId}`);
  }, FIVE_SECONDS);

  return graph ? <img alt="" src={graph} className={styles.graph} /> : null;
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
});

export default connect(mapStateToProps)(Graph);
