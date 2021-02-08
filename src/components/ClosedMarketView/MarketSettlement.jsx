import React from 'react';
import { IsEmpty } from 'react-lodash';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/marketSettlementStyle';

export default ({ marketInfo }) => {
  const classes = useStyles();
  const createdAt = new Date(Date.now()).toLocaleString('en-GB', { timeZone: 'UTC' });

  const renderMarketStartTime = (isEmpty) => () => {
    if (isEmpty) return '';

    const marketDetails = `${new Date(marketInfo.marketStartTime).toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    })} ${marketInfo.marketName} ${marketInfo.event.venue}`;
    return <p className={classes.marketName}>{marketDetails}</p>;
  };

  return (
    <div className={classes.container}>
      <div className={classes.title}>Flash Betting Market Settlement</div>
      <div className={classes.marketReportContainer}>
        <div>
          <IsEmpty value={marketInfo} yes={renderMarketStartTime(true)} no={renderMarketStartTime(false)} />
          <em className="marketstats-info-created-at">
            Created
            {createdAt}
            {' '}
            (commission not included)
          </em>
        </div>

        <a href={`${window.location.origin}/dashboard`} className={classes.backButton}>
          Back To Dashboard →
        </a>
      </div>
    </div>
  );
};
