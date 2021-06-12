import { isEmpty } from 'lodash';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import useInterval from '../../hooks/useInterval';
import useTools from '../../hooks/useTools';
//* Actions
import { setIsLoading, setPremiumStatus } from '../../redux/actions/settings';
import {
  setInitialClk,
  setClk,
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  setEvent,
  setEventType,
  closeMarket,
  loadLadder,
  setSortedLadder,
  setRunner,
  loadRunners,
  loadNonRunners,
  setMarketStatus,
  setInPlay,
  setInPlayTime,
} from '../../redux/actions/market';
import { updateExcludedLadders, updateLadderOrder, setMarketPL } from '../../redux/actions/ladder';
import { removeUnmatchedBet, setBetExecutionComplete } from '../../redux/actions/bet';
import { updateBackList } from '../../redux/actions/back';
import { updateLayList } from '../../redux/actions/lay';
import { updateStopLossList, placeStopLossBet, setStopLossBetMatched, updateStopLossTicks } from '../../redux/actions/stopLoss';
import { updateTickOffsetList, placeTickOffsetBet } from '../../redux/actions/tickOffset';
import { updateStopEntryList, placeStopEntryBet } from '../../redux/actions/stopEntry';
import { updateFillOrKillList } from '../../redux/actions/fillOrKill';
import Spinner from './Spinner';
import Siderbar from '../Sidebar';
import HomeView from '../HomeView';
import Views from '../Views';
import SocketContext from '../../contexts/SocketContext';
import Title from './Title';
import PremiumPopup from '../PremiumPopup';
//* HTTP
import fetchData from '../../http/fetchData';
import { updateOrderMatched } from '../../http/dbHelper';
import Draggable from '../Draggable';
//* Utils
import handleAuthError from '../../utils/Errors/handleAuthError';
import getQueryVariable from '../../utils/Market/GetQueryVariable';
import { CreateRunners } from '../../utils/Market/CreateRunners';
//* Utils > Ladder
import { sortLadders, sortGreyHoundMarket } from '../../utils/ladder/SortLadder';
import { UpdateLadder } from '../../utils/ladder/UpdateLadder';
import { CreateLadder } from '../../utils/ladder/CreateLadder';
//* Utils > Bets
import loadCustomBets from '../../utils/Bets/LoadCustomBets';
import ExtractCustomerStrategyRfs from '../../utils/Bets/ExtractCustomerStrategyRfs';
//* Utils > Trading Tools
import { isTickOffsetTriggered } from '../../utils/TradingStategy/TickOffset';
import { isStopLossTriggered, checkAndExecuteStopLoss } from '../../utils/TradingStategy/StopLoss';
import { checkAndExecuteStopEntry } from '../../utils/TradingStategy/StopEntry';
import ConnectionStatus from '../ConnectionStatus';
//* JSS
import useStyles from '../../jss';
//* Constants
import { ONE_SECOND, FLASH_BETTING_URI } from '../../constants';

const cookies = new Cookies();

const App = ({
  view,
  isLoading,
  marketOpen,
  marketId,
  nonRunners,
  unmatchedBets,
  matchedBets,
  stopLossList,
  tickOffsetList,
  stopEntryList,
  socket,
  setIsLoading,
  setPremiumStatus,
  setInitialClk,
  setClk,
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  ladders,
  eventTypeId,
  setEvent,
  setEventType,
  closeMarket,
  loadLadder,
  sortedLadder,
  setSortedLadder,
  updateExcludedLadders,
  setRunner,
  loadRunners,
  loadNonRunners,
  setMarketStatus,
  inPlayTime,
  setInPlay,
  setInPlayTime,
  setMarketPL,
  setStopLossBetMatched,
  placeStopLossBet,
  updateStopLossList,
  updateStopLossTicks,
  updateTickOffsetList,
  placeTickOffsetBet,
  updateStopEntryList,
  placeStopEntryBet,
  updateLayList,
  updateBackList,
  removeUnmatchedBet,
  setBetExecutionComplete,
  updateFillOrKillList,
}) => {
  const classes = useStyles();
  const [marketUpdates, setMarketUpdates] = useState([]);
  const [lastMarketUpdate, setLastMarketUpdate] = useState(new Date());
  const [connectionError, setConnectionError] = useState('');
  useTools();

  const getPremiumStatus = async () => {
    const vendorClientId = await fetchData('/api/get-vendor-client-id');
    const isPremium = await fetchData(`${FLASH_BETTING_URI}premium-status?user=${cookies.get('username')}&vendorClientId=${vendorClientId}`);
    if (isPremium.error) {
      setPremiumStatus(false);
    } else {
      setPremiumStatus(isPremium);
    }
  };

  const onReceiveMarketDefinition = useCallback(
    async (marketDefinition) => {
      setMarketStatus(marketDefinition.status);
      setInPlay(marketDefinition.inPlay);
      console.log('market definition', marketDefinition);

      if (!inPlayTime && marketDefinition.inPlay) {
        // Start the in-play clock once we get the 'in play' signal
        setInPlayTime(new Date(marketDefinition.marketTime));
      }

      if (marketDefinition.status === 'CLOSED') {
        window.open(`${window.location.origin}/getClosedMarketStats?marketId=${marketId}`);
        if (marketOpen) {
          closeMarket();
        }
      }
    },
    [inPlayTime, marketOpen, marketId],
  );

  /**
   * Listen for Market Change Messages from the Exchange Streaming socket and create/update them
   * @param {obj} data The market change message data: { rc: [(atb, atl, tv, ltp, id)] }
   */
  const handleMarketMessage = useCallback(
    (mc) => {
      mc.forEach(async ({ rc, marketDefinition }) => {
        const updatedLadders = { ...ladders };
        const updatedNonRunners = { ...nonRunners };

        // Update the market status
        if (marketDefinition) {
          const { runners } = marketDefinition;
          for (let i = 0; i < runners.length; i += 1) {
            const { id, status } = runners[i];
            if (status === 'REMOVED') {
              if (!updatedNonRunners[id]) {
                updatedNonRunners[id] = runners[i];
              }
              if (updatedLadders[id]) {
                delete updatedLadders[id];
              }
            }
          }
          loadNonRunners(updatedNonRunners);
        }

        if (rc) {
          for (let i = 0; i < rc.length; i += 1) {
            const { id } = rc[i];
            if (updatedLadders[id]) {
              //* Runner found so we update our object with the mc runner data
              updatedLadders[id] = UpdateLadder(updatedLadders[id], rc[i]);
              const currentLTP = rc[i].ltp || updatedLadders[id].ltp[0];

              checkAndExecuteStopEntry(stopEntryList, id, currentLTP, placeStopEntryBet);
              checkAndExecuteStopLoss(stopLossList[id], currentLTP, updatedLadders[id].ltp, matchedBets, placeStopLossBet, updateStopLossTicks);
            } else if (!nonRunners[id] && !updatedNonRunners[id]) {
              // Runner found so we create the new object with the raw data
              updatedLadders[id] = CreateLadder(rc[i]);

              if (i === rc.length - 1) {
                sortLadders(eventTypeId, updatedLadders, sortedLadder, updateLadderOrder, setSortedLadder, updateExcludedLadders, true);
              }
            }
          }
        }
        loadLadder(updatedLadders);
      });
    },
    [ladders, nonRunners, stopEntryList, unmatchedBets, matchedBets, stopLossList, eventTypeId],
  );

  /**
   * Listen for bet Change Messages from the Exchange Streaming socket and create/update them
   * @param {obj} data The bet change message data:
   */
  const onReceiveOrderMessage = useCallback(
    async (data) => {
      if (data.oc) {
        for (let i = 0; i < data.oc.length; i += 1) {
          if (data.oc[i].orc) {
            for (let j = 0; j < data.oc[i].orc.length; j += 1) {
              if (data.oc[i].orc[j].uo) {
                const { id: selectionId } = data.oc[i].orc[j];
                for (let k = 0; k < data.oc[i].orc[j].uo.length; k += 1) {
                  // If the bet isn't in the unmatchedBets, we should delete it.
                  const { id: betId, avp: averagePriceMatched, sr: sizeRemaining, sm: sizeMatched, rfs, status } = data.oc[i].orc[j].uo[k];
                  if (sizeRemaining === 0 && sizeMatched === 0) {
                    //! this is what happens when an bet doesn't get any matched
                    removeUnmatchedBet({ betId });
                  } else if (status === 'EXECUTION_COMPLETE' && unmatchedBets[betId] && !matchedBets[betId]) {
                    setBetExecutionComplete({ betId, sizeMatched, sizeRemaining, price: averagePriceMatched });
                  }

                  //* Check if the stop loss is matched to initiate the trigger
                  const isStopLossMatched = isStopLossTriggered(stopLossList[selectionId], rfs, sizeRemaining);
                  if (isStopLossMatched) {
                    setStopLossBetMatched({ selectionId });
                    updateOrderMatched({ rfs, assignedIsOrderMatched: true });
                  }
                  const tosTriggered = isTickOffsetTriggered(tickOffsetList[selectionId], rfs, sizeMatched);
                  if (tosTriggered) placeTickOffsetBet({ tickOffset: tickOffsetList[selectionId] });
                }
              }
            }
          }
        }
      }
    },
    [matchedBets, stopLossList, tickOffsetList],
  );

  const onMarketDisconnect = useCallback(async ({ errorCode, errorMessage }) => {
    console.log('market disconnected', errorCode, errorMessage);
    handleAuthError(errorCode);
    if (errorMessage) {
      setConnectionError(errorMessage.split(':')[0]);
    }
  }, []);

  const retrieveMarket = async () => {
    const marketId = getQueryVariable('marketId');

    // Check if the page has query parameter 'marketId'
    // Load the market if found
    if (marketId) {
      const marketCatalogue = await fetchData(`/api/get-market-info?marketId=${marketId}`);
      if (marketCatalogue && marketCatalogue.length >= 1) {
        console.log(marketCatalogue[0]);
        const { marketId, marketName, marketStartTime, description, event, eventType, runners } = marketCatalogue[0];
        setSortedLadder(sortGreyHoundMarket(eventType.id, runners));
        setMarketId(marketId);
        setMarketName(marketName);
        setMarketDescription(description);
        setMarketStartTime(marketStartTime);
        setEvent(event);
        setEventType(eventType);
        loadRunners(CreateRunners(runners));
        setRunner(runners[0]);

        //* Subscribe to Market Change Messages (MCM) via the Exchange Streaming API
        socket.emit('market-subscription', { marketId });

        // Load the customer orders in this market from database into state
        // Usually happens when orders are made in a market which is later reopened
        const { backOrders, layOrders, stopEntryOrders, tickOffsetOrders, fillOrKillOrders, stopLossOrders } = await loadCustomBets(marketId);

        updateBackList(backOrders);
        updateLayList(layOrders);
        updateStopEntryList(stopEntryOrders);
        updateTickOffsetList(tickOffsetOrders);
        updateFillOrKillList(fillOrKillOrders);
        updateStopLossList(stopLossOrders);
      }
    }
  };

  useInterval(() => {
    const now = new Date();
    const timeElapsed = now - lastMarketUpdate;
    if (timeElapsed >= ONE_SECOND && !isEmpty(marketUpdates)) {
      const { initialClk, clk, mc } = marketUpdates[0];

      if (initialClk) setInitialClk(initialClk);
      if (clk) setClk(clk);
      if (mc) handleMarketMessage(mc);

      setMarketUpdates((updates) => updates.slice(1, updates.length));
      setLastMarketUpdate(new Date());
    }
  }, ONE_SECOND);

  useEffect(() => {
    const loadData = async () => {
      await getPremiumStatus();
      await retrieveMarket();
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (marketOpen && marketId) {
      const customerStrategyRefs = ExtractCustomerStrategyRfs(unmatchedBets);
      if (customerStrategyRefs.length > 0) {
        socket.emit('order-subscription', {
          customerStrategyRefs: JSON.stringify(customerStrategyRefs),
        });
      }
    }
  }, [marketOpen, marketId, socket, unmatchedBets]);

  useEffect(() => {
    socket.on('mcm', ({ mc, clk, initialClk }) => setMarketUpdates((updates) => [...updates, { mc, clk, initialClk }]));
    socket.on('ocm', onReceiveOrderMessage);
    socket.on('subscription-error', onMarketDisconnect);
    socket.on('market-definition', onReceiveMarketDefinition);

    return () => {
      socket.off('mcm');
      socket.off('ocm');
      socket.off('subscription-error');
      socket.off('market-definition');
    };
  }, [onMarketDisconnect, onReceiveMarketDefinition, setMarketUpdates, onReceiveOrderMessage, socket]);

  useEffect(() => {
    (async () => {
      if (marketOpen && marketId) {
        const result = await fetchData(`/api/list-market-pl?marketId=${marketId}`);
        if (result && result[0]) {
          const selectionPL = result[0].profitAndLosses.reduce((acc, item) => {
            acc[item.selectionId] = item.ifWin;
            return acc;
          }, {});
          setMarketPL(selectionPL);
        }
      }
    })();
  }, [marketOpen, marketId, matchedBets]);

  return isLoading ? (
    <Spinner />
  ) : (
    <div className="root">
      <Title />
      <Siderbar />
      <main className={classes.container}>
        <ConnectionStatus connectionError={connectionError} setConnectionError={setConnectionError} socket={socket} />
        <Draggable />
        {Views[view] || <HomeView />}
        <PremiumPopup />
      </main>
    </div>
  );
};

const AppWithSocket = (props) => <SocketContext.Consumer>{(socket) => <App {...props} socket={socket} />}</SocketContext.Consumer>;

const mapStateToProps = (state) => ({
  view: state.settings.view,
  isLoading: state.settings.isLoading,
  inPlay: state.market.inPlay,
  inPlayTime: state.market.inPlayTime,
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
  eventTypeId: state.market.eventType.id,
  ladders: state.market.ladder,
  sortedLadder: state.market.sortedLadder,
  nonRunners: state.market.nonRunners,
  unmatchedBets: state.order.bets.unmatched,
  matchedBets: state.order.bets.matched,
  stopLossList: state.stopLoss.list,
  tickOffsetList: state.tickOffset.list,
  stopEntryList: state.stopEntry.list,
});

const mapDispatchToProps = {
  setIsLoading,
  setPremiumStatus,
  setInitialClk,
  setClk,
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  setEvent,
  setEventType,
  closeMarket,
  loadLadder,
  setSortedLadder,
  updateLadderOrder,
  updateExcludedLadders,
  setRunner,
  loadRunners,
  loadNonRunners,
  setMarketStatus,
  setInPlay,
  setInPlayTime,
  setMarketPL,
  setStopLossBetMatched,
  placeStopLossBet,
  updateStopLossList,
  updateStopLossTicks,
  updateTickOffsetList,
  placeTickOffsetBet,
  updateStopEntryList,
  placeStopEntryBet,
  updateLayList,
  updateBackList,
  removeUnmatchedBet,
  setBetExecutionComplete,
  updateFillOrKillList,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);
