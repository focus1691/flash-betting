import React from "react";
import { connect } from "react-redux";
import Ladders from "./Ladders";
import Tools from "./Tools/";
import UnmatchedBets from "./UnmatchedBets";
import MatchedBets from "./MatchedBets";
import Graph from "./Graphs";
import MarketInfo from "./MarketInfo";
import Rules from "./Rules";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

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
  },
  group: {
    margin: theme.spacing(1, 0)
  }
}));

const Market = props => {
  const classes = useStyles();

  const createTitle = (name, position) => {
    return (
      <AppBar className={classes.appBar} position={position || "absolute"}>
        <Typography variant="h6" className={classes.title}>
          {name}
        </Typography>
      </AppBar>
    );
  };

  return (
    <React.Fragment>
      <Ladders />

      {props.tools.visible ? (
        <React.Fragment>
          {createTitle("Tools", "static")}
          <Tools />
        </React.Fragment>
      ) : null}

      {props.unmatchedBets.visible ? (
        <React.Fragment>
          {createTitle("Unmatched Bets", "static")}
          <UnmatchedBets />
        </React.Fragment>
      ) : null}

      {props.matchedBets.visible ? (
        <React.Fragment>
          {createTitle("Matched Bets", "static")}
          <MatchedBets />
        </React.Fragment>
      ) : null}

      {props.graphs.visible ? (
        <React.Fragment>
          {createTitle("Graphs", "static")}
          <Graph />
        </React.Fragment>
      ) : null}

      {props.marketInfo.visible ? (
        <React.Fragment>
          {createTitle("Market Information", "static")}
          <MarketInfo />
        </React.Fragment>
      ) : null}

      {props.rules.visible ? (
        <React.Fragment>
          {createTitle("Rules", "static")}
          <Rules />
        </React.Fragment>
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
