import { isEmpty } from 'lodash';
import React, { useEffect, useCallback, useRef } from 'react';
import { connect } from 'react-redux';
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
  setRunner,
  loadRunners,
  loadRunnerResults,
  setMarketStatus,
  reconnectSocket,
} from '../../redux/actions/market';
import { updateBackList } from '../../redux/actions/back';
import { updateLayList } from '../../redux/actions/lay';
import { updateStopLossList } from '../../redux/actions/stopLoss';
import { updateTickOffsetList } from '../../redux/actions/tickOffset';
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
import Draggable from '../Draggable';
//* Utils
import getQueryVariable from '../../utils/Market/GetQueryVariable';
import { CreateRunners } from '../../utils/Market/CreateRunners';
//* Utils > Bets
import loadCustomBets from '../../utils/Bets/LoadCustomBets';
//* Utils > Trading Tools
import handleAuthError from '../../utils/Errors/handleAuthError';
import ConnectionStatus from '../ConnectionStatus';
//* JSS
import useStyles from '../../jss';

const App = ({
  initialClk,
  clk,
  view,
  isLoading,
  marketOpen,
  marketId,
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
  setRunner,
  loadRunners,
  loadRunnerResults,
  setMarketStatus,
  updateStopLossList,
  updateTickOffsetList,
  updateStopEntryList,
  updateLayList,
  updateBackList,
  updateFillOrKillList,
  reconnectSocket,
}) => {
  const classes = useStyles();
  useTools();

  const hasAddedSockets = useRef(false);

  // const getPremiumStatus = useCallback(async () => {
  //   const vendorClientId = await fetchData('/api/get-vendor-client-id');
  //   if (vendorClientId) {
  //     setUserId(vendorClientId);
  //     setPremiumStatus(true);
  //   }
  // }, []);

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
        const { marketId, marketName, marketStartTime, description, event, eventType, runners } = marketCatalogue[0];
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
      } else {
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
      // await getPremiumStatus();
      await retrieveMarket();
      await setIsLoading(false);
    };
    loadData();
  }, []);

  const onMarketDisconnect = async ({ errorCode, errorMessage }) => {
    console.log('onMarketDisconnect', errorCode, errorMessage);
    if (errorCode) {
      handleAuthError(errorCode);
    }
    if (marketOpen && errorMessage) {
      setConnectionErrorMessage(errorMessage.split(':')[0]);
    }
  }

  useEffect(() => {
    if (hasAddedSockets.current || !socket || !marketId) return;

    hasAddedSockets.current = true;

    socket.on('mcm', processMarketUpdates);
    socket.on('connection-disconnected', onMarketDisconnect);
    socket.on('reconnect', () => reconnectSocket({socket}));
  }, [socket, marketId]);

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
  initialClk: state.market.initialClk,
  clk: state.market.clk,
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
  setRunner,
  loadRunners,
  loadRunnerResults,
  setMarketStatus,
  updateStopLossList,
  updateTickOffsetList,
  updateStopEntryList,
  updateLayList,
  updateBackList,
  updateFillOrKillList,
  reconnectSocket,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppWithSocket);
