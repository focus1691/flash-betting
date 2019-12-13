import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { openGraph } from "../../../actions/draggable";

const Graph = props => {
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    if (props.marketOpen && props.selection) {
      const marketId = props.market.marketId.slice(
        2,
        props.market.marketId.length
      );
      const URI = `https://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=${marketId}&selectionId=${props.selection.selectionId}&handicap=0`;
      setGraph(URI);
    }
  }, [props.selection, props.market.marketId, props.marketOpen]);

  return (
    <div id="menu-graph">
      {graph ? <img alt={"Chart"} src={graph} onDoubleClick={props.onOpenGraph()} /> : null}
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

const mapDispatchToProps = dispatch => {
  return {
    onOpenGraph: () => e => dispatch(openGraph())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Graph);
