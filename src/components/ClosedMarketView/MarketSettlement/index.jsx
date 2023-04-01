import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import moment from 'moment';
//* @material-ui core
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../../jss/components/ClosedMarketView/marketSettlementStyle';

const cookies = new Cookies();

const MarketSettlement = ({ id, marketName, marketStartTime, venue }) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Typography component="h1" variant="h2" className={styles.title}>
        Market Settlement
        <div>
          <Chip className={styles.user} color="primary" label={`${cookies.get('username')} | ID ${id}`} />
        </div>
      </Typography>
      <div className={styles.marketReportContainer}>
        <div>
          <p className={styles.marketName}>{marketStartTime && `${moment(marketStartTime).calendar()} ${marketName} ${venue}`}</p>
          <em className={styles.createdAt}>{`Created ${moment().format('MMMM Do YYYY, h:mm:ss a')} (commission not included)`}</em>
        </div>

        <a href={`${window.location.origin}/dashboard`} className={styles.backButton}>
          Back To Dashboard →
        </a>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  id: state.account.id,
  marketName: state.market.marketName,
  marketStartTime: state.market.marketStartTime,
  venue: state.market.event.venue,
});

export default connect(mapStateToProps)(MarketSettlement);
