import React, { useState } from "react";
import { connect } from "react-redux";
import Ladders from "./Ladders";
import Tools from "./OrderTools";
import UnmatchedBets from "./UnmatchedBets";
import MatchedBets from "./MatchedBets";
import Graph from "./Graphs";
import MarketInfo from "./MarketInfo";
import Rules from "./Rules";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid #fff",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
  },
  expanded: {}
})(MultiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    zIndex: "1",
  },
  expanded: {}
})(MultiExpansionPanelSummary);

const useStyles = makeStyles(theme => ({
  appBar: {
    background: "#303030",
    color: "orange",
    fontWeight: "900",
    border: "2px solid #fff",
    zIndex: "1"
  },
  title: {
    textAlign: "center",
    fontWeight: "bold"
  }
}));

const Market = props => {
  const classes = useStyles();
  const [laddersExpanded, setLaddersExpanded] = useState(true);
  const [toolsExpanded, setToolsExpanded] = useState(true);
  const [unmatchedBetsExpanded, setUnmatchedBetsExpanded] = useState(true);
  const [matchedBetsExpanded, setMatchedBetsExpanded] = useState(true);
  const [graphExpanded, setGraphExpanded] = useState(true);
  const [marketInfoExpanded, setMarketInfoExpanded] = useState(true);
  const [rulesExpanded, setRulesExpanded] = useState(true);

  const createTitle = (name, position) => {
    return (
      <AppBar className={classes.appBar} position={position || "absolute"}>
        <Typography variant="h6" className={classes.title}>
          {name}
        </Typography>
      </AppBar>
    );
  };

  const createExpansionPanelSummary = name => {
    return (
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {createTitle(name)}
      </ExpansionPanelSummary>
    );
  };

  const createExpansionPanelSummaryUnmatchedBets = name => {
    return (
      <ExpansionPanelSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <AppBar className={classes.appBar} position={"absolute"}>
          <Typography variant="h6" className={classes.title}>
            {name}
            <button
              className={"cancel-order-btn"}
              style={{ height: "22px", width: "auto", display: "inline-block", zIndex: "999" }}
              onClick={e => {
                e.stopPropagation();
              }}
            >
              <img src={`${window.location.origin}/icons/error.png`} alt="X" />
            </button>
          </Typography>
        </AppBar>
      </ExpansionPanelSummary>
    );
  };

  return (
    <React.Fragment>
      <ExpansionPanel
        expanded={laddersExpanded}
        onChange={e => setLaddersExpanded(!laddersExpanded)}
      >
        {createExpansionPanelSummary("Ladders")}
        <Ladders />
      </ExpansionPanel>

      {props.tools.visible ? (
        <ExpansionPanel
          expanded={toolsExpanded}
          onChange={e => setToolsExpanded(!toolsExpanded)}
        >
          {createExpansionPanelSummary("Tools")}
          <Tools />
        </ExpansionPanel>
      ) : null}

      {props.unmatchedBets.visible ? (
        <ExpansionPanel
          expanded={unmatchedBetsExpanded}
          onChange={e => setUnmatchedBetsExpanded(!unmatchedBetsExpanded)}
        >
          {createExpansionPanelSummaryUnmatchedBets("Unmatched Bets")}
          <UnmatchedBets />
        </ExpansionPanel>
      ) : null}

      {props.matchedBets.visible ? (
        <ExpansionPanel
          expanded={matchedBetsExpanded}
          onChange={e => setMatchedBetsExpanded(!matchedBetsExpanded)}
        >
          {createExpansionPanelSummary("Matched Bets")}
          <MatchedBets />
        </ExpansionPanel>
      ) : null}

      {props.graphs.visible ? (
        <ExpansionPanel
          expanded={graphExpanded}
          onChange={e => setGraphExpanded(!graphExpanded)}
        >
          {createExpansionPanelSummary("Graphs")}
          <Graph />
        </ExpansionPanel>
      ) : null}

      {props.marketInfo.visible ? (
        <ExpansionPanel
          expanded={marketInfoExpanded}
          onChange={e => setMarketInfoExpanded(!marketInfoExpanded)}
        >
          {createExpansionPanelSummary("Market Information")}
          <MarketInfo />
        </ExpansionPanel>
      ) : null}

      {props.rules.visible ? (
        <ExpansionPanel
          expanded={rulesExpanded}
          onChange={e => setRulesExpanded(!rulesExpanded)}
        >
          {createExpansionPanelSummary("Rules")}
          <Rules />
        </ExpansionPanel>
      ) : null}
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    tools: state.settings.tools,
    unmatchedBets: state.settings.unmatchedBets,
    matchedBets: state.settings.matchedBets,
    profitAndLoss: state.settings.profitAndLoss,
    graphs: state.settings.graphs,
    marketInfo: state.settings.marketInfo,
    rules: state.settings.rules
  };
};

export default connect(mapStateToProps)(Market);
