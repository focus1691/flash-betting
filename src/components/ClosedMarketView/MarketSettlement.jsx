import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import _ from 'lodash';
import moment from 'moment';
//* @material-ui core
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/ClosedMarketView/marketSettlementStyle';

const cookies = new Cookies();

const MarketSettlement = ({ id, marketInfo, premiumMember }) => {
  const classes = useStyles({ subscribed: premiumMember });

  return (
    <div className={classes.container}>
      <Typography component="h1" variant="h2" className={classes.title}>
        Flash Betting Market Settlement
        <div>
          <Chip className={classes.user} color="primary" label={`${cookies.get('username')} | ID ${id}`} />
          <Chip className={classes.subscription} label={`Subscription: ${premiumMember ? 'Active' : 'Expired'}`} />
        </div>
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

const mapStateToProps = (state) => ({
  id: state.account.id,
  premiumMember: state.settings.premiumMember,
});

export default connect(mapStateToProps)(MarketSettlement);
