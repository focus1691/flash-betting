import AppBar from "@material-ui/core/AppBar";
import MultiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MultiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useCallback } from "react";
import { connect } from "react-redux";
import { updateBackList } from "../../../actions/back";
import { updateFillOrKillList } from "../../../actions/fillOrKill";
import { updateLayList } from "../../../actions/lay";
import { cancelOrders } from "../../../actions/order";
import { setGraphExpanded, setLaddersExpanded, setMarketInfoExpanded, setMatchedBetsExpanded, setRulesExpanded, setToolsExpanded, setUnmatchedBetsExpanded } from "../../../actions/settings";
import { updateStopEntryList } from "../../../actions/stopEntry";
import { updateStopLossList } from "../../../actions/stopLoss";
import { updateTickOffsetList } from "../../../actions/tickOffset";
import Graph from "./Graphs";
import Ladders from "./Ladders";
import MarketInfo from "./MarketInfo";
import MatchedBets from "./MatchedBets";
import Tools from "./OrderTools";
import Rules from "./Rules";
import UnmatchedBets from "./UnmatchedBets/UnmatchedBets";
import { getMatchedBets, getUnmatchedBets } from "../../../selectors/orderSelector";

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid #fff",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
      margin: 0,
    },
  },
  expanded: {}
})(MultiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    zIndex: "1",
    "&$expanded": {
      minHeight: "0px",
    },
  },
  expanded: {
    minHeight: "0px",
  },
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

const Market = ({tools, unmatchedBets, matchedBets, graphs, marketInfo, rules, stopLossList, tickOffsetList, stopEntryList,
  layList, backList, fillOrKillList, laddersExpanded, toolsExpanded, unmatchedBetsExpanded, matchedBetsExpanded, graphExpanded, marketInfoExpanded,
  rulesExpanded, matchedOrders, unmatchedOrders, onChangeStopLossList, onChangeTickOffsetList, onChangeStopEntryList, onChangeLayList, onChangeBackList, onChangeFillOrKillList,
  onLaddersExpanded, onToolsExpanded, onUnmatchedBetsExpanded, onMatchedBetsExpanded, onGraphsExpanded, onMarketInfoExpanded, onRulesExpanded}) => {

  const classes = useStyles();

  const cancelAllUnmatchedOrders = useCallback(async () => {
		if (unmatchedOrders) {
			const data = await cancelOrders(Object.values(unmatchedOrders), matchedOrders, unmatchedOrders, backList, layList, stopLossList, tickOffsetList, stopEntryList, fillOrKillList, null);
			onChangeBackList(data.back);
			onChangeLayList(data.lay);
			onChangeStopLossList(data.stopLoss);
			onChangeTickOffsetList(data.tickOffset);
			onChangeStopEntryList(data.stopEntry);
			onChangeFillOrKillList(data.fillOrKill);
		}
  }, [backList, fillOrKillList, layList, matchedOrders, onChangeBackList, onChangeFillOrKillList, onChangeLayList, onChangeStopEntryList, onChangeStopLossList, onChangeTickOffsetList, stopEntryList, stopLossList, tickOffsetList, unmatchedOrders]);

  const renderTitle = (name, position) => {
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
        {renderTitle(name)}
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
              style={{ height: "22px", width: "auto", display: "inline-block", zIndex: "999", float: "right", marginTop: "0.3em" }}
              onClick={cancelAllUnmatchedOrders}
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
        onChange={onLaddersExpanded(!laddersExpanded)}
      >
        {createExpansionPanelSummary("Ladders")}
        <Ladders />
      </ExpansionPanel>

      {tools.visible ? (
        <ExpansionPanel
          expanded={toolsExpanded}
          onChange={onToolsExpanded(!toolsExpanded)}
        >
          {createExpansionPanelSummary("Tools")}
          <Tools />
        </ExpansionPanel>
      ) : null}

      {unmatchedBets.visible ? (
        <ExpansionPanel
          expanded={unmatchedBetsExpanded}
          onChange={onUnmatchedBetsExpanded(!unmatchedBetsExpanded)}
        >
          {createExpansionPanelSummaryUnmatchedBets("Unmatched Bets")}
          <UnmatchedBets />
        </ExpansionPanel>
      ) : null}

      {matchedBets.visible ? (
        <ExpansionPanel
          expanded={matchedBetsExpanded}
          onChange={onMatchedBetsExpanded(!matchedBetsExpanded)}
        >
          {createExpansionPanelSummary("Matched Bets")}
          <MatchedBets />
        </ExpansionPanel>
      ) : null}

      {graphs.visible ? (
        <ExpansionPanel
          expanded={graphExpanded}
          onChange={onGraphsExpanded(!graphExpanded)}
        >
          {createExpansionPanelSummary("Graphs")}
          <Graph />
        </ExpansionPanel>
      ) : null}

      {marketInfo.visible ? (
        <ExpansionPanel
          expanded={marketInfoExpanded}
          onChange={onMarketInfoExpanded(!marketInfoExpanded)}
        >
          {createExpansionPanelSummary("Market Information")}
          <MarketInfo />
        </ExpansionPanel>
      ) : null}

      {rules.visible ? (
        <ExpansionPanel
          expanded={rulesExpanded}
          onChange={onRulesExpanded(!rulesExpanded)}
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
    graphs: state.settings.graphs,
    marketInfo: state.settings.marketInfo,
    rules: state.settings.rules,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list,
    layList: state.lay.list,
    backList: state.back.list,
    fillOrKillList: state.fillOrKill.list,
    laddersExpanded: state.settings.laddersExpanded,
    toolsExpanded: state.settings.toolsExpanded,
    unmatchedBetsExpanded: state.settings.unmatchedBetsExpanded,
    matchedBetsExpanded: state.settings.matchedBetsExpanded,
    graphExpanded: state.settings.graphExpanded,
    marketInfoExpanded: state.settings.marketInfoExpanded,
    rulesExpanded: state.settings.rulesExpanded,
    matchedOrders: getMatchedBets(state.order.bets),
    unmatchedOrders: getUnmatchedBets(state.order.bets)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeStopLossList: list => dispatch(updateStopLossList(list)),
    onChangeTickOffsetList: list => dispatch(updateTickOffsetList(list)),
    onChangeStopEntryList: list => dispatch(updateStopEntryList(list)),
    onChangeLayList: list => dispatch(updateLayList(list)),
    onChangeBackList: list => dispatch(updateBackList(list)),
    onChangeFillOrKillList: list => dispatch(updateFillOrKillList(list)),
    onLaddersExpanded: expanded => e => dispatch(setLaddersExpanded(expanded)),
    onToolsExpanded: expanded => e => dispatch(setToolsExpanded(expanded)),
    onUnmatchedBetsExpanded: expanded => e => dispatch(setUnmatchedBetsExpanded(expanded)),
    onMatchedBetsExpanded: expanded => e => dispatch(setMatchedBetsExpanded(expanded)),
    onGraphsExpanded: expanded => e => dispatch(setGraphExpanded(expanded)),
    onMarketInfoExpanded: expanded => e => dispatch(setMarketInfoExpanded(expanded)),
    onRulesExpanded: expanded => e => dispatch(setRulesExpanded(expanded))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
