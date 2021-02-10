import React, { useEffect, useState } from 'react';
//* Components
import BetsPlaced from './BetsPlaced';
import MarketReport from './MarketReport';
import MarketSettlement from './MarketSettlement';
//* HTTP
import fetchData from '../../http/fetchData';
//* Utils
import getQueryVariable from '../../utils/Market/GetQueryVariable';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView';

const ClosedMarketView = () => {
  const classes = useStyles();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [runners, setRunners] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  const marketId = getQueryVariable('marketId');

  useEffect(() => {
    (async function getMarketResult() {
      //* Runners[] (selectionId, runnerName, status)
      const marketBook = await fetchData(`/api/list-market-book?marketId=${marketId}`);
      const marketCatalogue = await fetchData(`api/get-market-info?marketId=${marketId}`);

      if (marketBook.length > 0 && marketCatalogue.length > 0) {
        // Store the race status of each runner
        const runnerStatus = {};
        marketBook[0].runners.forEach(({ selectionId, status }) => {
          runnerStatus[selectionId] = status;
        });

        // Conflate the id/name with the status
        const runners = marketCatalogue[0].runners.map(({ selectionId, runnerName }) => ({ selectionId, runnerName, status: runnerStatus[selectionId] })).filter(({ status }) => status !== 'REMOVED');
        setRunners(runners);

        setMarketInfo(marketCatalogue[0]);
      }

      //* Orders
      const { currentOrders } = await fetchData(`/api/listCurrentOrders?marketId=${marketId}`);
      const completedOrders = currentOrders.filter((order) => order.status === 'EXECUTION_COMPLETE');
      setCompletedOrders(completedOrders);
    })();
  }, []);

  return (
    <div className={classes.container}>
      <MarketSettlement marketInfo={marketInfo} />
      <div className={classes.tables}>
        <MarketReport matchedBets={completedOrders} runners={runners} />
        <BetsPlaced matchedBets={completedOrders} runners={runners} />
      </div>
    </div>
  );
};

export default ClosedMarketView;
