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
import { combineUnmatchedOrders } from "../../../utils/Bets/CombineUnmatchedOrders";
import { updateStopLossList } from "../../../actions/stopLoss";
import { updateTickOffsetList } from "../../../actions/tickOffset";
import { updateStopEntryList } from "../../../actions/stopEntry";
import { updateLayList } from "../../../actions/lay";
import { updateBackList } from "../../../actions/back";
import { updateFillOrKillList } from "../../../actions/fillOrKill";
import { cancelOrderAction, updateOrders } from "../../../actions/order";

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

const Market = props => {

  const allUnmatchedSpecialBets = combineUnmatchedOrders(props.backList, props.layList, props.stopEntryList, props.tickOffsetList, props.stopLossList, {})

  const cancelSpecialOrders = orders => {

    let ordersToRemove = [];
    const newBackList = Object.assign({}, props.backList);
    const newLayList = Object.assign({}, props.layList);
    const newStopEntryList = Object.assign({}, props.stopEntryList);
    const newTickOffsetList = Object.assign({}, props.tickOffsetList);
    const newStopLossList = Object.assign({}, props.stopLossList);
    const newFillOrKill = Object.assign({}, props.fillOrKillList)
    Object.values(orders).map(selection => {
      Object.values(selection).map(rfs => {
        rfs.map(order => {
          // figure out which strategy it's using and make a new array without it
          switch (order.strategy) {
            case "Back":
              newBackList[order.selectionId] = newBackList[order.selectionId].filter(item => item.rfs !== order.rfs)
              break;
            case "Lay":
              newLayList[order.selectionId] = newLayList[order.selectionId].filter(item => item.rfs !== order.rfs)
              break;
            case "Stop Entry":
              newStopEntryList[order.selectionId] = newStopEntryList[order.selectionId].filter(item => item.rfs !== order.rfs)
              break;
            case "Tick Offset":
              delete newTickOffsetList[order.rfs]
              break;
            case "Stop Loss":
              delete newStopLossList[order.selectionId];
              break;
            case "None":
              // if we can find something that fits with the fill or kill, we can remove that (this is because we don't make another row for fill or kill)
              if (props.fillOrKillList[order.betId] !== undefined) {
                ordersToRemove = ordersToRemove.concat(newFillOrKill[order.betId])
                delete newFillOrKill[order.betId];
                
              }
              break;
            default:
              break;
          }
        
          ordersToRemove = ordersToRemove.concat(order);

          // delete from database
          try {
            fetch('/api/remove-orders', {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify(ordersToRemove)
            })
          } catch (e) {
        
          }
        })
      })
    })

      props.onChangeBackList(newBackList);
      props.onChangeLayList(newLayList);
      props.onChangeStopEntryList(newStopEntryList);
      props.onChangeTickOffsetList(newTickOffsetList)
      props.onChangeStopLossList(newStopLossList)
      props.onChangeFillOrKillList(newFillOrKill)

  };
  

  const cancelAllOrdersInMarket = async (marketId, unmatchedBets, matchedBets, specialBets, betCanceler) => {

    betCanceler(specialBets)
    
    const currentOrders = await fetch(`/api/listCurrentOrders?marketId=${marketId}`).then(res => res.json()).then(res => res.currentOrders);

    if (currentOrders) {
      // filter all the ones out that arent in the same selection or arent unmatched
      const openSelectedRunnerOrders = currentOrders.filter(order => (order.status === "EXECUTABLE" || order.status === "PENDING"))

      // this is basically calling 1 bet after another and returning the unmatched bets it gets from it
      const cancelBets = await openSelectedRunnerOrders.reduce(async (previousPromise, nextOrder) => {
        const previousCancelOrderUnmatchedBets = await previousPromise;
        return cancelOrderAction({
          marketId: nextOrder.marketId,
          betId: nextOrder.betId,
          sizeReduction: null,
          matchedBets: matchedBets,
          unmatchedBets: previousCancelOrderUnmatchedBets && previousCancelOrderUnmatchedBets.unmatched ? previousCancelOrderUnmatchedBets.unmatched : unmatchedBets,
        });
      }, Promise.resolve());

      if (cancelBets === undefined) return;

      props.onUpdateBets({
        unmatched: cancelBets.unmatched,
        matched: cancelBets.matched
      })
    }

  }

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
              style={{ height: "22px", width: "auto", display: "inline-block", zIndex: "999", float: "right", marginTop: "0.3em" }}
              onClick={e => {
                e.stopPropagation();
                cancelAllOrdersInMarket(props.market.marketId, props.bets.unmatched, props.bets.matched, allUnmatchedSpecialBets, cancelSpecialOrders)
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
    rules: state.settings.rules,
    market: state.market.currentMarket,
    bets: state.order.bets,
    stopLossList: state.stopLoss.list,
    tickOffsetList: state.tickOffset.list,
    stopEntryList: state.stopEntry.list,
    layList: state.lay.list,
    backList: state.back.list,
    fillOrKillList: state.fillOrKill.list,
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
    onUpdateBets: bets => dispatch(updateOrders(bets)), // this is for the bets
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
