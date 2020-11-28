import React, { useCallback } from 'react';
import { connect } from 'react-redux';
//* MUI Core
import AppBar from '@material-ui/core/AppBar';
import MultiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MultiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
//* Actions
import { cancelMarketBets } from '../../../actions/bet';
import { removeAllBackBets } from '../../../actions/back';
import { removeAllLayBets } from '../../../actions/lay';
import { removeAllStopEntryBets } from '../../../actions/stopEntry';
import { removeAllStopLoss } from '../../../actions/stopLoss';
import { removeAllTickOffset } from '../../../actions/tickOffset';
import { removeAllFillOrKill } from '../../../actions/fillOrKill';
import { setGraphExpanded, setLaddersExpanded, setMarketInfoExpanded, setMatchedBetsExpanded, setRulesExpanded, setToolsExpanded, setUnmatchedBetsExpanded } from '../../../actions/settings';
import { updateLadderOrder, setSortedLadder, updateExcludedLadders } from '../../../actions/market';
import Graph from './Graphs';
import Ladders from './Ladders';
import MarketInfo from './MarketInfo';
import MatchedBets from './MatchedBets';
import Tools from './OrderTools';
import Rules from './Rules';
import UnmatchedBets from './UnmatchedBets/UnmatchedBets';
import { getMarketUnmatchedBets } from '../../../selectors/orderSelector';
import { sortLadder } from '../../../utils/ladder/SortLadder';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid #fff',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
      margin: 0,
    },
  },
  expanded: {},
})(MultiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    zIndex: '1',
    '&$expanded': {
      minHeight: '0px',
    },
  },
  expanded: {
    minHeight: '0px',
  },
})(MultiExpansionPanelSummary);

const useStyles = makeStyles(() => ({
  appBar: {
    background: '#303030',
    color: 'orange',
    fontWeight: '900',
    border: '2px solid #fff',
    zIndex: '1',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
}));

const Market = ({
  tools,
  unmatchedBets,
  matchedBets,
  graphs,
  marketInfo,
  rules,
  laddersExpanded,
  toolsExpanded,
  unmatchedBetsExpanded,
  matchedBetsExpanded,
  graphExpanded,
  marketInfoExpanded,
  rulesExpanded,
  unmatchedMarketBets,
  setLaddersExpanded,
  setToolsExpanded,
  setUnmatchedBetsExpanded,
  setMatchedBetsExpanded,
  setGraphExpanded,
  setMarketInfoExpanded,
  setRulesExpanded,
  ladders,
  eventType,
  setSortedLadder,
  updateExcludedLadders,
  updateLadderOrder,
  cancelMarketBets,
  removeAllBackBets,
  removeAllLayBets,
  removeAllStopEntryBets,
  removeAllStopLoss,
  removeAllTickOffset,
  removeAllFillOrKill,
}) => {
  const classes = useStyles();

  const cancelAllUnmatchedOrders = useCallback(
    async (e) => {
      e.stopPropagation();
      setUnmatchedBetsExpanded(true);
      if (unmatchedMarketBets) {
        cancelMarketBets(unmatchedMarketBets);
      }

      removeAllBackBets();
      removeAllLayBets();
      removeAllStopEntryBets();
      removeAllStopLoss();
      removeAllTickOffset();
      removeAllFillOrKill();
    },
    [cancelMarketBets, removeAllBackBets, removeAllFillOrKill, removeAllLayBets, removeAllStopEntryBets, removeAllStopLoss, removeAllTickOffset, setUnmatchedBetsExpanded, unmatchedMarketBets],
  );

  const reorderByLTP = useCallback(
    (e) => {
      e.stopPropagation();
      setLaddersExpanded(true);
      if (eventType !== '4339') {
        const sortedLadderIndices = sortLadder(ladders);
        setSortedLadder(sortedLadderIndices);
        updateExcludedLadders(sortedLadderIndices);
        const newOrderList = {};
        for (let j = 0; j < sortedLadderIndices.length; j += 1) {
          newOrderList[j] = sortedLadderIndices[j];
        }
        updateLadderOrder(newOrderList);
      }
    },
    [eventType, ladders, setLaddersExpanded, setSortedLadder, updateExcludedLadders, updateLadderOrder],
  );

  const renderTitle = (name, position) => (
    <AppBar className={classes.appBar} position={position || 'absolute'}>
      <Typography variant="h6" className={classes.title}>
        {name}
      </Typography>
    </AppBar>
  );

  const createExpansionPanelSummary = (name) => (
    <ExpansionPanelSummary aria-controls={`${name}-content`} id={`${name}-header`}>
      {renderTitle(name)}
    </ExpansionPanelSummary>
  );

  const createExpansionPanelSummaryLadders = (name) => (
    <ExpansionPanelSummary aria-controls={`${name}-content`} id={`${name}-header`}>
      <AppBar className={classes.appBar} position="absolute">
        <Typography variant="h6" className={classes.title}>
          {name}
          <button
            type="button"
            className="refresh-btn"
            style={{
              height: '22px',
              width: 'auto',
              display: 'inline-block',
              zIndex: '999',
              float: 'right',
              marginTop: '0.3em',
            }}
            onClick={reorderByLTP}
          >
            <img src={`${window.location.origin}/icons/refresh.png`} alt="R" />
          </button>
        </Typography>
      </AppBar>
    </ExpansionPanelSummary>
  );

  const createExpansionPanelSummaryUnmatchedBets = (name) => (
    <ExpansionPanelSummary aria-controls="unmatched-bets-content" id="unmatched-bets-header">
      <AppBar className={classes.appBar} position="absolute">
        <Typography variant="h6" className={classes.title}>
          {name}
          <button
            type="button"
            className="cancel-order-btn"
            style={{
              height: '22px',
              width: 'auto',
              display: 'inline-block',
              zIndex: '999',
              float: 'right',
              marginTop: '0.3em',
            }}
            onClick={cancelAllUnmatchedOrders}
          >
            <img src={`${window.location.origin}/icons/error.png`} alt="X" />
          </button>
        </Typography>
      </AppBar>
    </ExpansionPanelSummary>
  );

  return (
    <>
      <ExpansionPanel expanded={laddersExpanded} onChange={(e) => setLaddersExpanded(!laddersExpanded)}>
        {createExpansionPanelSummaryLadders('Ladders')}
        <Ladders />
      </ExpansionPanel>

      {tools.visible ? (
        <ExpansionPanel expanded={toolsExpanded} onChange={(e) => setToolsExpanded(!toolsExpanded)}>
          {createExpansionPanelSummary('Tools')}
          <Tools />
        </ExpansionPanel>
      ) : null}

      {unmatchedBets.visible ? (
        <ExpansionPanel expanded={unmatchedBetsExpanded} onChange={(e) => setUnmatchedBetsExpanded(!unmatchedBetsExpanded)}>
          {createExpansionPanelSummaryUnmatchedBets('Unmatched Bets')}
          <UnmatchedBets />
        </ExpansionPanel>
      ) : null}

      {matchedBets.visible ? (
        <ExpansionPanel expanded={matchedBetsExpanded} onChange={(e) => setMatchedBetsExpanded(!matchedBetsExpanded)}>
          {createExpansionPanelSummary('Matched Bets')}
          <MatchedBets />
        </ExpansionPanel>
      ) : null}

      {graphs.visible ? (
        <ExpansionPanel expanded={graphExpanded} onChange={(e) => setGraphExpanded(!graphExpanded)}>
          {createExpansionPanelSummary('Graphs')}
          <Graph />
        </ExpansionPanel>
      ) : null}

      {marketInfo.visible ? (
        <ExpansionPanel expanded={marketInfoExpanded} onChange={(e) => setMarketInfoExpanded(!marketInfoExpanded)}>
          {createExpansionPanelSummary('Market Information')}
          <MarketInfo />
        </ExpansionPanel>
      ) : null}

      {rules.visible ? (
        <ExpansionPanel expanded={rulesExpanded} onChange={(e) => setRulesExpanded(!rulesExpanded)}>
          {createExpansionPanelSummary('Rules')}
          <Rules />
        </ExpansionPanel>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  ladders: state.market.ladder,
  eventType: state.market.eventType,
  excludedLadders: state.market.excludedLadders,
  tools: state.settings.tools,
  unmatchedBets: state.settings.unmatchedBets,
  matchedBets: state.settings.matchedBets,
  graphs: state.settings.graphs,
  marketInfo: state.settings.marketInfo,
  rules: state.settings.rules,
  laddersExpanded: state.settings.laddersExpanded,
  toolsExpanded: state.settings.toolsExpanded,
  unmatchedBetsExpanded: state.settings.unmatchedBetsExpanded,
  matchedBetsExpanded: state.settings.matchedBetsExpanded,
  graphExpanded: state.settings.graphExpanded,
  marketInfoExpanded: state.settings.marketInfoExpanded,
  rulesExpanded: state.settings.rulesExpanded,
  unmatchedMarketBets: getMarketUnmatchedBets(state.order.bets, { marketId: state.market.marketId }),
});

const mapDispatchToProps = {
  setLaddersExpanded,
  setToolsExpanded,
  setUnmatchedBetsExpanded,
  setMatchedBetsExpanded,
  setGraphExpanded,
  setMarketInfoExpanded,
  setRulesExpanded,
  updateLadderOrder,
  setSortedLadder,
  updateExcludedLadders,
  cancelMarketBets,
  removeAllBackBets,
  removeAllLayBets,
  removeAllStopEntryBets,
  removeAllStopLoss,
  removeAllTickOffset,
  removeAllFillOrKill,
};

export default connect(mapStateToProps, mapDispatchToProps)(Market);
