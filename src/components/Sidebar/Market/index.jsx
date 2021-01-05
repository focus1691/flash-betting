import React, { useCallback } from 'react';
import { connect } from 'react-redux';
//* @material-ui core
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
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
//* JSS
import useStyles from '../../../jss/components/Sidebar/market';
//* Custom @material-ui components
import SectionBar from '../../../jss/components/Sidebar/SectionBar';
import SectionContent from '../../../jss/components/Sidebar/SectionContent';

const Market = ({
  marketOpen,
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

  const createAccordionSummaryLadders = (name) => (
    <SectionContent>
      <AppBar className={classes.appBar} position="absolute">
        <Typography variant="h6" className={classes.title}>
          {name}
          <button type="button" className={clsx(classes.button, classes.appBarButton)} onClick={reorderByLTP}>
            <img src={`${window.location.origin}/icons/Refresh_Icon.svg`} alt="" />
          </button>
        </Typography>
      </AppBar>
    </SectionContent>
  );

  return (
    <>
      <SectionBar expanded={laddersExpanded} onChange={() => setLaddersExpanded(!laddersExpanded)}>
        {createAccordionSummaryLadders('Ladders')}
        <div className={marketOpen ? classes.ladderContainer : ''}>
          <Ladders />
        </div>
      </SectionBar>

      {tools.visible ? (
        <SectionBar expanded={toolsExpanded} onChange={() => setToolsExpanded(!toolsExpanded)}>
          <SectionContent>
            {renderTitle('Tools')}
          </SectionContent>
          <div className={classes.container}>
            <Tools />
          </div>
        </SectionBar>
      ) : null}

      {unmatchedBets.visible ? (
        <SectionBar expanded={unmatchedBetsExpanded} onChange={() => setUnmatchedBetsExpanded(!unmatchedBetsExpanded)}>
          <SectionContent>
            <AppBar className={classes.appBar} position="absolute">
              <Typography variant="h6" className={classes.title}>
                Unmatched Bets
                <button type="button" className={clsx(classes.button, classes.appBarButton)} onClick={cancelAllUnmatchedOrders}>
                  <img src={`${window.location.origin}/icons/X_Button.svg`} alt="X" />
                </button>
              </Typography>
            </AppBar>
          </SectionContent>
          <UnmatchedBets />
        </SectionBar>
      ) : null}

      {matchedBets.visible ? (
        <SectionBar expanded={matchedBetsExpanded} onChange={() => setMatchedBetsExpanded(!matchedBetsExpanded)}>
          <SectionContent>
            {renderTitle('Matched Bets')}
          </SectionContent>
          <MatchedBets />
        </SectionBar>
      ) : null}

      {graphs.visible ? (
        <SectionBar expanded={graphExpanded} onChange={() => setGraphExpanded(!graphExpanded)}>
          <SectionContent>
            {renderTitle('Graphs')}
          </SectionContent>
          <Graph />
        </SectionBar>
      ) : null}

      {marketInfo.visible ? (
        <SectionBar expanded={marketInfoExpanded} onChange={() => setMarketInfoExpanded(!marketInfoExpanded)}>
          <SectionContent>
            {renderTitle('Market Information')}
          </SectionContent>
          <MarketInfo />
        </SectionBar>
      ) : null}

      {rules.visible ? (
        <SectionBar expanded={rulesExpanded} onChange={() => setRulesExpanded(!rulesExpanded)}>
          <SectionContent>
            {renderTitle('Rules')}
          </SectionContent>
          <Rules />
        </SectionBar>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  marketOpen: state.market.marketOpen,
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
