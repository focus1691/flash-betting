import React from "react";
import { connect } from "react-redux";
import Ladders from "./Ladders";
import Tools from "./Tools";
import UnmatchedBets from "./UnmatchedBets";
import MatchedBets from "./MatchedBets";
import ProfitLoss from "./ProfitLoss";
import Graph from "./Graphs";
import MarketInfo from "./MarketInfo";
import { withStyles } from "@material-ui/core/styles";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MultiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import useStyles from "../../Styles/Styles";

const ExpansionPanel = withStyles({
    root: {
      border: "1px solid #fff",
      boxShadow: "none",
      "&:not(:last-child)": {
        borderBottom: 0
      },
      "&:before": {
        display: "none"
      },
      "&$expanded": {
        margin: "auto"
      },
      backgroundColor: "#fff",
      color: "orange",
      fontWeight: "900"
    },
    expanded: {}
  })(MultiExpansionPanel);
  
  const ExpansionPanelSummary = withStyles({
    root: {
      backgroundColor: "rgba(0, 0, 0, .03)",
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
      marginBottom: -1,
      minHeight: 56,
      "&$expanded": {
        minHeight: 56
      }
    },
    content: {
      "&$expanded": {
        margin: "12px 0"
      }
    },
    expanded: {}
  })(MultiExpansionPanelSummary);
  
  const ExpansionPanelDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MultiExpansionPanelDetails);


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

      {props.profitAndLoss.visible ? (
        <React.Fragment>
          {createTitle("Profit & Loss", "static")}
          <ProfitLoss />
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
      marketInfo: state.settings.marketInfo
    };
  };
  
  export default connect(mapStateToProps)(Market);
  