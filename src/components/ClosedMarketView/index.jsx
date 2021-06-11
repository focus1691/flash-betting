import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
//* Actions
import { setPremiumStatus } from '../../redux/actions/settings';
//* Components
import BetsPlaced from './BetsPlaced';
import MarketReport from './MarketReport';
import MarketSettlement from './MarketSettlement';
//* HTTP
import fetchData from '../../http/fetchData';
//* Utils
import getQueryVariable from '../../utils/Market/GetQueryVariable';
//* Constants
import { FLASH_BETTING_URI } from '../../constants';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView';

const ClosedMarketView = ({ runners, setPremiumStatus }) => {
  const classes = useStyles();
  const [completedOrders, setCompletedOrders] = useState([]);
  const [runnerDetails, setRunnerDetails] = useState([]);
  const [marketInfo, setMarketInfo] = useState({});
  const marketId = getQueryVariable('marketId');

  useEffect(() => {
    (async function getMarketResult() {
      //* Load premium in case this route is accessed directly
      const premiumMember = await fetchData(`${FLASH_BETTING_URI}premium?user=traderjosh`);
      if (premiumMember.error) {
        setPremiumStatus(false);
      } else {
        setPremiumStatus(premiumMember);
      }

      //* Runners[] (selectionId, runnerName, status)
      const marketBook = await fetchData(`/api/list-market-book?marketId=${marketId}`);
      const marketCatalogue = await fetchData(`api/get-market-info?marketId=${marketId}`);

      if (marketBook.length > 0) {
        //* runners will be empty if route is accessed directly for selected marketId
        //* Otherwise it will remain in redux from the market open
        if (_.isEmpty(runners)) {
          //! marketCatalogue runner {} contains the runner name
          if (marketCatalogue.length > 0) {
            // Store the race status of each runner
            const runnerStatus = {};
            marketBook[0].runners.forEach(({ selectionId, status }) => {
              runnerStatus[selectionId] = status;
            });

            // Conflate the selectionId / runnerName with the race status
            const runnerDetails = marketCatalogue[0].runners.map(({ selectionId, runnerName }) => ({ selectionId, runnerName, status: runnerStatus[selectionId] })).filter(({ status }) => status !== 'REMOVED');
            setRunnerDetails(runnerDetails);

          } else {
            //! Runner name not retrievable in redux, or in the marketCatalogue, proceed without it
            const runnerDetails = marketBook[0].runners.map(({ selectionId, status }) => ({ selectionId, status, runnerName: '' })).filter(({ status }) => status !== 'REMOVED');
            setRunnerDetails(runnerDetails);
          }        
        } else {
          //! Runner name is retrievable through in the runners {} from redux
          const runnerDetails = marketBook[0].runners.map(({ selectionId, status }) => ({ selectionId, status, runnerName: runners[selectionId].runnerName })).filter(({ status }) => status !== 'REMOVED');
          setRunnerDetails(runnerDetails);
        }
      }

      if (marketCatalogue.length > 0) {
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
        <MarketReport matchedBets={completedOrders} runners={runnerDetails} />
        <BetsPlaced matchedBets={completedOrders} runners={runnerDetails} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  runners: state.market.runners,
});

const mapDispatchToProps = {
  setPremiumStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClosedMarketView);
