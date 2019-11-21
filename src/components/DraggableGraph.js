import React, { useState } from "react";
import { connect } from "react-redux";
import { openGraph } from "../actions/graph";

const DraggableGraph = props => {

  const [transparent, setTransparent] = useState(false);

  if (props.selection) {
    console.log(props.selection);
  }

  return props.selection && props.graph.open ? (
    <div className={"popup-graph"} style={{ opacity: transparent ? 0.5 : 1 }}>
      <div>
        <span>{props.selection.runnerName}</span>
        <span className={"popup-graph-toggle-transparency"} onClick={e => setTransparent(!transparent)}>{transparent ? "Solid" : "Transparent"}</span>
        <img
          alt={"Close"}
          className={"close-popup-graph"}
          src={`${window.location.origin}/icons/error.png`}
          onClick={props.onOpenGraph()}
        />
      </div>
      <img
        alt={"Chart"}
        style={{ pointerEvents: 'none' }}
        src={`https://sportsiteexweb.betfair.com/betting/LoadRunnerInfoChartAction.do?marketId=${props.market.marketId.slice(
          2,
          props.market.marketId.length
        )}&selectionId=${props.selection.selectionId}&handicap=0`}
      />
    </div>
  ) : null;
};

const mapStateToProps = state => {
  return {
    marketOpen: state.market.marketOpen,
    market: state.market.currentMarket,
    selection: state.market.runnerSelection,
    graph: state.graph
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOpenGraph: () => e => dispatch(openGraph())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableGraph);
