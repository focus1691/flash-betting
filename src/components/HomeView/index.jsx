import React from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
//* Custom Components
import Header from './Header';
import RecentBets from './RecentBets';
import TradingChart from './TradingChart';
import SubscriptionContainer from './SubscriptionContainer';
//* Actions
import { openPremiumDialog, setSelectedPremium } from '../../actions/settings';
//* JSS
import useStyles from '../../jss/components/HomeView/homeViewStyle';

const cookies = new Cookies();

const HomeView = ({ premiumMember, openPremiumDialog, setSelectedPremium }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header username={cookies.get('username')} premiumMember={premiumMember} />
      <TradingChart />
      <RecentBets />
      <div className={classes.subscriptionList}>
        {premiumMember ? null : (
          <>
            <SubscriptionContainer openPremiumDialog={openPremiumDialog} setSelectedPremium={setSelectedPremium} classes={classes} />
            <SubscriptionContainer plan="Biannually" price={49.99} color="green" openPremiumDialog={openPremiumDialog} setSelectedPremium={setSelectedPremium} classes={classes} />
            <SubscriptionContainer plan="Annually" price={99.99} openPremiumDialog={openPremiumDialog} setSelectedPremium={setSelectedPremium} classes={classes} />
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  premiumMember: state.settings.premiumMember,
});

const mapDispatchToProps = { openPremiumDialog, setSelectedPremium };

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
