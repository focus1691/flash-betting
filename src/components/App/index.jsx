import { isEmpty } from 'lodash';
import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import useTools from '../../hooks/useTools';
//* Actions
import { setUserId } from '../../redux/actions/account';
import { setIsLoading, setPremiumStatus } from '../../redux/actions/settings';
import {
  processMarketUpdates,
  setConnectionErrorMessage,
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  setEvent,
  setEventType,
  closeMarket,
  setSortedLadder,
  setRunner,
  loadRunners,
  loadRunnerResults,
  setMarketStatus,
} from '../../redux/actions/market';
import { updateLadderOrder, setMarketPL } from '../../redux/actions/ladder';
import { removeUnmatchedBet, setBetExecutionComplete } from '../../redux/actions/bet';
import { updateBackList } from '../../redux/actions/back';
import { updateLayList } from '../../redux/actions/lay';
import { updateStopLossList, setStopLossBetMatched } from '../../redux/actions/stopLoss';
import { updateTickOffsetList, placeTickOffsetBet } from '../../redux/actions/tickOffset';
import { updateStopEntryList } from '../../redux/actions/stopEntry';
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
import updateCustomOrder from '../../http/updateCustomOrder';
import Draggable from '../Draggable';
//* Utils
import getQueryVariable from '../../utils/Market/GetQueryVariable';
import { CreateRunners } from '../../utils/Market/CreateRunners';
//* Utils > Ladder
import { sortGreyHoundMarket } from '../../utils/ladder/SortLadder';
//* Utils > Bets
import loadCustomBets from '../../utils/Bets/LoadCustomBets';
import ExtractCustomerStrategyRfs from '../../utils/Bets/ExtractCustomerStrategyRfs';
//* Utils > Trading Tools
import { isTickOffsetTriggered } from '../../utils/TradingStategy/TickOffset';
import { isStopLossTriggered } from '../../utils/TradingStategy/StopLoss';
import handleAuthError from '../../utils/Errors/handleAuthError';
import ConnectionStatus from '../ConnectionStatus';
//* JSS
import useStyles from '../../jss';
//* Constants
import { FLASH_BETTING_URL } from '../../constants';

const cookies = new Cookies();

const App = ({
  view,
  isLoading,
  marketOpen,
  marketId,
  unmatchedBets,
  matchedBets,
  stopLossList,
  tickOffsetList,
  socket,
  setUserId,
  setIsLoading,
  setPremiumStatus,
  processMarketUpdates,
  setConnectionErrorMessage,
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  setEvent,
  setEventType,
  closeMarket,
  setSortedLadder,
  setRunner,
  loadRunners,
  loadRunnerResults,
  setMarketStatus,
  setMarketPL,
  setStopLossBetMatched,
  updateStopLossList,
  updateTickOffsetList,
  placeTickOffsetBet,
  updateStopEntryList,
  updateLayList,
  updateBackList,
  removeUnmatchedBet,
  setBetExecutionComplete,
  updateFillOrKillList,
}) => {
  const classes = useStyles();
  useTools();

  const getPremiumStatus = useCallback(async () => {
    const vendorClientId = await fetchData('/api/get-vendor-client-id');
    if (vendorClientId) {
      setUserId(vendorClientId);

      try {
        const isPremium = await fetchData(`${FLASH_BETTING_URL}premium-status?user=${cookies.get('username')}&vendorClientId=${vendorClientId}`);
        setPremiumStatus(Boolean(isPremium));
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

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
                    updateCustomOrder('update-bet-matched', { rfs, assignedIsOrderMatched: true });
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
    if (errorMessage) {
      handleAuthError(errorCode);
      setConnectionErrorMessage(errorMessage.split(':')[0]);
    }
  }, []);

  const retrieveMarket = useCallback(async () => {
    const marketId = getQueryVariable('marketId');

    // Check if the page has query parameter 'marketId'
    // Load the market if found
    if (marketId) {
        // Load the customer orders in this market from database into state
        // Usually happens when orders are made in a market which is later reopened
        const { backOrders, layOrders, stopEntryOrders, tickOffsetOrders, fillOrKillOrders, stopLossOrders } = await loadCustomBets(marketId);

        updateBackList(backOrders);
        updateLayList(layOrders);
        updateStopEntryList(stopEntryOrders);
        updateTickOffsetList(tickOffsetOrders);
        updateFillOrKillList(fillOrKillOrders);
        updateStopLossList(stopLossOrders);

      const marketCatalogue = await fetchData(`/api/get-market-info?marketId=${marketId}`);

      if (!isEmpty(marketCatalogue)) {
        console.log('market catlaogue empty');
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
      }
      else {
        const marketBook = await fetchData(`/api/list-market-book?marketId=${marketId}`);

        if (!isEmpty(marketBook)) {
          const { marketId, status, runners } = marketBook[0];
          // Load the results
          setMarketId(marketId);
          setMarketStatus(status);
          loadRunnerResults(runners);
          if (status === 'CLOSED') {
            closeMarket();
          }
        }
      }
    }
  }, [socket]);

  useEffect(() => {
    const loadData = async () => {
      await getPremiumStatus();
      await retrieveMarket();
      await setIsLoading(false);
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
    socket.on('mcm', (data) => processMarketUpdates(data));
    socket.on('ocm', onReceiveOrderMessage);
    socket.on('subscription-error', onMarketDisconnect);

    return () => {
      socket.off('mcm');
      socket.off('ocm');
      socket.off('subscription-error');
    };
  }, [onMarketDisconnect, onReceiveOrderMessage, socket]);

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
        <ConnectionStatus socket={socket} />
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
  marketOpen: state.market.marketOpen,
  marketId: state.market.marketId,
  unmatchedBets: state.order.bets.unmatched,
  matchedBets: state.order.bets.matched,
  stopLossList: state.stopLoss.list,
  tickOffsetList: state.tickOffset.list,
});

const mapDispatchToProps = {
  setIsLoading,
  setUserId,
  setPremiumStatus,
  processMarketUpdates,
  setConnectionErrorMessage,
  setMarketId,
  setMarketName,
  setMarketDescription,
  setMarketStartTime,
  setEvent,
  setEventType,
  closeMarket,
  setSortedLadder,
  updateLadderOrder,
  setRunner,
  loadRunners,
  loadRunnerResults,
  setMarketStatus,
  setMarketPL,
  setStopLossBetMatched,
  updateStopLossList,
  updateTickOffsetList,
  placeTickOffsetBet,
  updateStopEntryList,
  updateLayList,
  updateBackList,
  removeUnmatchedBet,
  setBetExecutionComplete,
  updateFillOrKillList,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);
