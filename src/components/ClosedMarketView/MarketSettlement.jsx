import React from 'react';
import moment from 'moment';
import { IsEmpty } from 'react-lodash';
//* @material-ui core
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/marketSettlementStyle';

export default ({ marketInfo }) => {
  const classes = useStyles();

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
      {/* <div className={classes.title}>Flash Betting Market Settlement</div> */}
      <Typography component="h1" variant="h2" className={classes.title}>
        Flash Betting Market Settlement
      </Typography>
      <div className={classes.marketReportContainer}>
        <div>
          <IsEmpty value={marketInfo} yes={renderMarketStartTime(true)} no={renderMarketStartTime(false)} />
          <em className={classes.createdAt}>
            {`Created ${moment().format('MMMM Do YYYY, h:mm:ss a')} (commission not included)`}
          </em>
        </div>

        <a href={`${window.location.origin}/dashboard`} className={classes.backButton}>
          Back To Dashboard →
        </a>
      </div>
    </div>
  );
};
