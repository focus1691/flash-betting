import React, { useEffect } from 'react';
import { connect } from 'react-redux';
//* Custom Components
import Header from './Header';
import RecentBets from './RecentBets';
// import TradingChart from './TradingChart';
import PremiumSubscription from './PremiumSubscription';
//* Actions
import { setUserId } from '../../redux/actions/account';
//* JSS
import useStyles from '../../jss/components/HomeView/homeViewStyle';
//* HTTP
import fetchData from '../../http/fetchData';

const HomeView = ({ premiumMember, setUserId }) => {
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const vendorClientId = await fetchData('/api/get-vendor-client-id');
      setUserId(vendorClientId);
    })();
  }, []);

  return (
    <div className={classes.root}>
      {premiumMember ? (
        <>
          <Header premiumMember={premiumMember} />
          {/* <TradingChart /> */}
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

const mapDispatchToProps = { setUserId };

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
