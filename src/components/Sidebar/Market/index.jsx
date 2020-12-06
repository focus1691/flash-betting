import React, { useCallback } from 'react';
import { connect } from 'react-redux';
//* MUI Core
import AppBar from '@material-ui/core/AppBar';
import MultiAccordion from '@material-ui/core/Accordion';
import MultiAccordionSummary from '@material-ui/core/AccordionSummary';
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

const Accordion = withStyles({
  root: {
    border: '1px solid #fff',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
      margin: 0,
    },
  },
  expanded: {},
})(MultiAccordion);

const AccordionSummary = withStyles({
  root: {
    zIndex: '1',
    '&$expanded': {
      minHeight: '0px',
    },
  },
  expanded: {
    minHeight: '0px',
  },
})(MultiAccordionSummary);

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

  const createAccordionSummary = (name) => (
    <AccordionSummary aria-controls={`${name}-content`} id={`${name}-header`}>
      {renderTitle(name)}
    </AccordionSummary>
  );

  const createAccordionSummaryLadders = (name) => (
    <AccordionSummary aria-controls={`${name}-content`} id={`${name}-header`}>
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
    </AccordionSummary>
  );

  const createAccordionSummaryUnmatchedBets = (name) => (
    <AccordionSummary aria-controls="unmatched-bets-content" id="unmatched-bets-header">
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
    </AccordionSummary>
  );

  return (
    <>
      <Accordion expanded={laddersExpanded} onChange={(e) => setLaddersExpanded(!laddersExpanded)}>
        {createAccordionSummaryLadders('Ladders')}
        <Ladders />
      </Accordion>

      {tools.visible ? (
        <Accordion expanded={toolsExpanded} onChange={(e) => setToolsExpanded(!toolsExpanded)}>
          {createAccordionSummary('Tools')}
          <Tools />
        </Accordion>
      ) : null}

      {unmatchedBets.visible ? (
        <Accordion expanded={unmatchedBetsExpanded} onChange={(e) => setUnmatchedBetsExpanded(!unmatchedBetsExpanded)}>
          {createAccordionSummaryUnmatchedBets('Unmatched Bets')}
          <UnmatchedBets />
        </Accordion>
      ) : null}

      {matchedBets.visible ? (
        <Accordion expanded={matchedBetsExpanded} onChange={(e) => setMatchedBetsExpanded(!matchedBetsExpanded)}>
          {createAccordionSummary('Matched Bets')}
          <MatchedBets />
        </Accordion>
      ) : null}

      {graphs.visible ? (
        <Accordion expanded={graphExpanded} onChange={(e) => setGraphExpanded(!graphExpanded)}>
          {createAccordionSummary('Graphs')}
          <Graph />
        </Accordion>
      ) : null}

      {marketInfo.visible ? (
        <Accordion expanded={marketInfoExpanded} onChange={(e) => setMarketInfoExpanded(!marketInfoExpanded)}>
          {createAccordionSummary('Market Information')}
          <MarketInfo />
        </Accordion>
      ) : null}

      {rules.visible ? (
        <Accordion expanded={rulesExpanded} onChange={(e) => setRulesExpanded(!rulesExpanded)}>
          {createAccordionSummary('Rules')}
          <Rules />
        </Accordion>
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
