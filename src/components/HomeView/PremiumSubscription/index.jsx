import React from 'react';
import { connect } from 'react-redux';
//* Custom Components
import SubscriptionContainer from './SubscriptionContainer';
//* Actions
import { openPremiumDialog, setSelectedPremium } from '../../../actions/settings';
//* JSS
import useStyles from '../../../jss/components/HomeView/premiumStyle';

const HomeView = ({ openPremiumDialog, setSelectedPremium }) => {
  const classes = useStyles();

  return (
    <div className={classes.subscriptionList}>
      <SubscriptionContainer openPremiumDialog={openPremiumDialog} setSelectedPremium={setSelectedPremium} classes={classes} />
      <SubscriptionContainer plan="Biannually" price={49.99} color="green" openPremiumDialog={openPremiumDialog} setSelectedPremium={setSelectedPremium} classes={classes} />
      <SubscriptionContainer plan="Annually" price={99.99} openPremiumDialog={openPremiumDialog} setSelectedPremium={setSelectedPremium} classes={classes} />
    </div>
  );
};

const mapDispatchToProps = { openPremiumDialog, setSelectedPremium };

export default connect(null, mapDispatchToProps)(HomeView);
