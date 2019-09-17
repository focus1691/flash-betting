import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const Graph = props => {
  const [graph, setGraph] = useState(
    window.location.origin + "/images/betfair-logo.png"
  );

  useEffect(() => {
    if (props.marketOpen && props.selection) {
      const marketId = props.market.marketId.slice(
        2,
        props.market.marketId.length
      );
      const URI = `http://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=${marketId}&selectionId=${props.selection.runnerId}&handicap=0`;
      setGraph(URI);
    }
  }, [props.selection]);

  return (
    <div>
      <div id="menu-graph">
        <img alt={"Chart"} src={graph} />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    market: state.market.currentMarket,
    marketOpen: state.market.marketOpen,
    selection: state.market.runnerSelection
  };
};

export default connect(mapStateToProps)(Graph);
