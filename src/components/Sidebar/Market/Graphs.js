import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

const Graph = props => {
  const [graph, setGraph] = useState(
    window.location.origin + "/images/Webp.net-resizeimage.png"
  );

  useEffect(() => {
    if (props.marketOpen && props.market.runners[props.selection]) {
      const marketId = props.market.marketId.slice(
        2,
        props.market.marketId.length
      );
      const selectionId = props.market.runners[props.selection].selectionId;
      const URI = `http://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=${marketId}&selectionId=${selectionId}&handicap=0`;
      setGraph(URI);
    }
  }, [props.market]);

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
    selection: state.market.runnerSelection,
    runners: state.market.runners
  };
};

export default connect(mapStateToProps)(Graph);
