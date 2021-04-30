import _ from 'lodash';
import crypto from 'crypto';
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import useInterval from '../../hooks/useInterval';
import useTools from '../../hooks/useTools';
//* Actions
import { setIsLoading, setPremiumStatus } from '../../actions/settings';
import {
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
  setMarketPL,
  updateLadderOrder,
  updateExcludedLadders,
} from '../../actions/market';
import { placeOrder, removeUnmatchedBet, setBetExecutionComplete } from '../../actions/bet';
import { updateBackList } from '../../actions/back';
import { updateLayList } from '../../actions/lay';
import { updateStopLossList, setStopLossBetMatched, removeStopLoss } from '../../actions/stopLoss';
import { updateTickOffsetList, removeTickOffset } from '../../actions/tickOffset';
import { updateStopEntryList, removeMultiSelectionStopEntryBets } from '../../actions/stopEntry';
import { updateFillOrKillList } from '../../actions/fillOrKill';
import Spinner from './Spinner';
import Siderbar from '../Sidebar';
import HomeView from '../HomeView';
import Views from '../Views';
import SocketContext from '../../contexts/SocketContext';
import Title from './Title';
import PremiumPopup from '../PremiumPopup';
//* HTTP
import fetchData from '../../http/fetchData';
import { removeBet, updateTicks, updateOrderMatched } from '../../http/dbHelper';
import Draggable from '../Draggable';
//* Utils
import handleAuthError from '../../utils/Errors/handleAuthError';
import getQueryVariable from '../../utils/Market/GetQueryVariable';
import { CreateRunners } from '../../utils/Market/CreateRunners';
//* Utils > Ladder
import { sortLadder, sortGreyHoundMarket } from '../../utils/ladder/SortLadder';
import { UpdateLadder } from '../../utils/ladder/UpdateLadder';
import { CreateLadder } from '../../utils/ladder/CreateLadder';
//* Utils > Bets
import loadCustomBets from '../../utils/Bets/LoadCustomBets';
import ExtractCustomerStrategyRfs from '../../utils/Bets/ExtractCustomerStrategyRfs';
//* Utils > Trading Tools
import { checkTickOffsetTrigger } from '../../utils/TradingStategy/TickOffset';
import { checkStopLossTrigger, checkStopLossHit } from '../../utils/TradingStategy/StopLoss';
import { checkStopEntryTargetMet, extractStopEntryRfs } from '../../utils/TradingStategy/StopEntry';
import CalculateLadderHedge from '../../utils/ladder/CalculateLadderHedge';
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
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  eventType,
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
  removeStopLoss,
  updateStopLossList,
  removeTickOffset,
  updateTickOffsetList,
  updateStopEntryList,
  removeMultiSelectionStopEntryBets,
  updateLayList,
  updateBackList,
  placeOrder,
  removeUnmatchedBet,
  setBetExecutionComplete,
  updateFillOrKillList,
}) => {
  const classes = useStyles();
  const [updates, setUpdates] = useState([]);
  const [isUpdated, setIsUpdated] = useState(true);
  const [initialClk, setInitialClk] = useState(null);
  const [clk, setClk] = useState(null);
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

      if (!inPlayTime && marketDefinition.inPlay) {
        // Start the in-play clock once we get the 'in play' signal
        setInPlayTime(new Date());
      }

      if (marketDefinition.status === 'CLOSED') {
        window.open(`${window.location.origin}/getClosedMarketStats?marketId=${marketId}`);
        if (marketOpen) {
          closeMarket();
        }
      }
    },
    [setMarketStatus, setInPlay, inPlayTime, marketOpen, setInPlayTime, closeMarket, marketId],
  );

  /**
   * Listen for Market Change Messages from the Exchange Streaming socket and create/update them
   * @param {obj} data The market change message data: { rc: [(atb, atl, tv, ltp, id)] }
   */
  const onReceiveMarketMessage = useCallback(
    ({ mc, clk, initialClk }) => {
      if (clk) setClk(clk);
      if (initialClk) setInitialClk(initialClk);

      mc.forEach(async ({ rc, marketDefinition }) => {
        const ladders = { ...updates };
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
              if (ladders[id]) {
                delete ladders[id];
              }
            }
          }
          loadNonRunners(updatedNonRunners);
        }

        if (rc) {
          for (let i = 0; i < rc.length; i += 1) {
            const { id } = rc[i];
            if (ladders[id]) {
              //* Runner found so we update our object with the mc runner data
              ladders[id] = UpdateLadder(ladders[id], rc[i]);

              const currentLTP = rc[i].ltp || ladders[id].ltp[0];

              // stop Entry
              const stopEntryBetsToRemove = checkStopEntryTargetMet(stopEntryList, id, currentLTP);
              if (!_.isEmpty(stopEntryBetsToRemove)) {
                for (let i = 0; i < stopEntryBetsToRemove.length; i += 1) {
                  const { rfs, marketId, selectionId, side, size, price } = stopEntryBetsToRemove[i];
                  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

                  placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef });
                  removeBet({ rfs }); // Remove from database
                }
                removeMultiSelectionStopEntryBets(extractStopEntryRfs(stopEntryBetsToRemove));
              }

              // Increment and check the stoplosses
              if (stopLossList[id] && stopLossList[id].assignedIsOrderMatched) {
                const SL = { ...stopLossList[id] };
                const prevLTP = ladders[id].ltp[1] || ladders[id].ltp[0];

                const targetMet = checkStopLossHit(SL, currentLTP);

                if (targetMet) {
                  const newMatchedBets = Object.values(matchedBets).filter((bet) => bet.selectionId == SL.selectionId);
                  const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);

                  const { rfs, marketId, selectionId, side, price } = SL;

                  // Calculate the hedged size for the price
                  const { size } = CalculateLadderHedge(parseFloat(price), newMatchedBets, 'hedged');

                  placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef });
                  removeStopLoss({ selectionId }); // Remove the SL
                  removeBet({ rfs }); // Remove the SL from DB
                } else if (SL.trailing && ((currentLTP < prevLTP && SL.side == 'BACK') || (currentLTP > prevLTP && SL.side == 'LAY'))) {
                  SL.ticks += 1;
                  updateTicks(SL); //! Update SQLite with new ticks
                  const newStopLossList = { ...stopLossList };
                  newStopLossList[SL.selectionId] = SL;
                  updateStopLossList(newStopLossList);
                }
              }
            } else if (!nonRunners[id] && !updatedNonRunners[id]) {
              // Runner found so we create the new object with the raw data
              ladders[id] = CreateLadder(rc[i]);

              if (i === rc.length - 1) {
                if (eventType.id === '4339') {
                  //! Used to track ladder bet when dragging & dropping ladders
                  const newOrderList = {};
                  for (let j = 0; j < sortedLadder.length; j += 1) {
                    newOrderList[j] = sortedLadder[j];
                  }
                  updateLadderOrder(newOrderList);
                } else {
                  const sortedLadderIndices = sortLadder(ladders);
                  setSortedLadder(sortedLadderIndices);
                  updateExcludedLadders(sortedLadderIndices.slice(6, sortedLadderIndices.length));
                  //! Used to track ladder bet when dragging & dropping ladders
                  const newOrderList = {};
                  for (let j = 0; j < sortedLadderIndices.length; j += 1) {
                    newOrderList[j] = sortedLadderIndices[j];
                  }
                  updateLadderOrder(newOrderList);
                }
              }
            }
          }
          setUpdates(ladders);
          setIsUpdated(false);
        }
      });
    },
    [updates, nonRunners, stopEntryList, unmatchedBets, matchedBets, stopLossList, eventType.id],
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
            const { id: marketId } = data.oc[i];
            for (let j = 0; j < data.oc[i].orc.length; j += 1) {
              if (data.oc[i].orc[j].uo) {
                const { id: selectionId } = data.oc[i].orc[j];
                for (let k = 0; k < data.oc[i].orc[j].uo.length; k += 1) {
                  // If the bet isn't in the unmatchedBets, we should delete it.
                  const { id: betId, s: size, p: price, sr: sizeRemaining, sm: sizeMatched, rfs, status } = data.oc[i].orc[j].uo[k];
                  if (sizeRemaining === 0 && sizeMatched === 0) {
                    //! this is what happens when an bet doesn't get any matched
                    removeUnmatchedBet({ betId });
                  } else if (status === 'EXECUTION_COMPLETE' && !matchedBets[betId]) {
                    setBetExecutionComplete({ betId, sizeMatched, sizeRemaining });
                  }

                  //* Check if the stop loss is matched to initiate the trigger
                  const isStopLossMatched = checkStopLossTrigger(stopLossList[selectionId], rfs, sizeRemaining);
                  if (isStopLossMatched) {
                    setStopLossBetMatched({ selectionId });
                    updateOrderMatched({ rfs, assignedIsOrderMatched: true });
                  }
                  const tosTriggered = checkTickOffsetTrigger(tickOffsetList[rfs], sizeMatched);
                  if (tosTriggered) {
                    const customerStrategyRef = crypto.randomBytes(15).toString('hex').substring(0, 15);
                    const { side } = tickOffsetList[rfs];

                    placeOrder({ marketId, selectionId, side, size, price, customerStrategyRef });

                    removeTickOffset({ selectionId }); // Remove from state
                    removeBet({ rfs }); // Remove from database
                  }
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
    if (!isUpdated) {
      loadLadder(updates);
      setIsUpdated(true);
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
    if (marketId) {
      const customerStrategyRefs = ExtractCustomerStrategyRfs(unmatchedBets);
      if (customerStrategyRefs.length > 0) {
        socket.emit('order-subscription', {
          customerStrategyRefs: JSON.stringify(customerStrategyRefs),
        });
      }
    }
  }, [marketId, socket, unmatchedBets]);

  useEffect(() => {
    socket.on('mcm', onReceiveMarketMessage);
    socket.on('ocm', onReceiveOrderMessage);
    socket.on('subscription-error', onMarketDisconnect);
    socket.on('market-definition', onReceiveMarketDefinition);

    return () => {
      socket.off('mcm');
      socket.off('ocm');
      socket.off('subscription-error');
      socket.off('market-definition');
    };
  }, [onMarketDisconnect, onReceiveMarketDefinition, onReceiveMarketMessage, onReceiveOrderMessage, socket]);

  useEffect(() => {
    (async () => {
      if (marketId) {
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
  }, [marketId, matchedBets, setMarketPL]);

  if (isLoading) return <Spinner />;
  return (
    <div className="horizontal-scroll-wrapper">
      <div className="root">
        <Title />
        <Siderbar />
        <main className={classes.container}>
          <ConnectionStatus connectionError={connectionError} setConnectionError={setConnectionError} marketId={marketId} clk={clk} initialClk={initialClk} socket={socket} />
          <Draggable />
          {Views[view] || <HomeView />}
          <PremiumPopup />
        </main>
      </div>
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
  eventType: state.market.eventType,
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
  removeStopLoss,
  updateStopLossList,
  removeTickOffset,
  updateTickOffsetList,
  updateStopEntryList,
  removeMultiSelectionStopEntryBets,
  updateLayList,
  updateBackList,
  placeOrder,
  removeUnmatchedBet,
  setBetExecutionComplete,
  updateFillOrKillList,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);
