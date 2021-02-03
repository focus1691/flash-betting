import React from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
//* Custom Components
import Header from './Header';
import RecentBets from './RecentBets';
import TradingChart from './TradingChart';
import PremiumSubscription from './PremiumSubscription';
//* JSS
import useStyles from '../../jss/components/HomeView/homeViewStyle';

const cookies = new Cookies();

const HomeView = ({ premiumMember }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {premiumMember ? (
        <>
          <Header username={cookies.get('username')} premiumMember={premiumMember} />
          <TradingChart />
          <RecentBets />
        </>
      ) : (
        <PremiumSubscription />
      )}
      ;
    </div>
  );
};

const mapStateToProps = (state) => ({
  premiumMember: state.settings.premiumMember,
});

export default connect(mapStateToProps)(HomeView);
