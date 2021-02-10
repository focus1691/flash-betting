import React from 'react';
import _ from 'lodash';
import moment from 'moment';
//* @material-ui core
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/marketSettlementStyle';

export default ({ marketInfo }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography component="h1" variant="h2" className={classes.title}>
        Flash Betting Market Settlement
      </Typography>
      <div className={classes.marketReportContainer}>
        <div>
          {_.isEmpty(marketInfo) ? null : <p className={classes.marketName}>{`${moment(marketInfo.marketStartTime).calendar()} ${marketInfo.marketName} ${marketInfo.event.venue}`}</p>}
          <em className={classes.createdAt}>{`Created ${moment().format('MMMM Do YYYY, h:mm:ss a')} (commission not included)`}</em>
        </div>

        <a href={`${window.location.origin}/dashboard`} className={classes.backButton}>
          Back To Dashboard →
        </a>
      </div>
    </div>
  );
};
