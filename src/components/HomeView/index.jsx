import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
//* Custom Components
import Header from './Header';
import SubscriptionContainer from './SubscriptionContainer';
//* Actions
import { openPremiumDialog, setSelectedPremium } from '../../actions/settings';
//* JSS
import useStyles from '../../jss/components/HomeView/homeViewStyle';

const cookies = new Cookies();

const HomeView = ({ premiumMember, openPremiumDialog, setSelectedPremium }) => {
  const [data, setData] = useState({});
  const classes = useStyles({ subscribed: premiumMember });

  useEffect(() => {
    premiumMember
      ? setData({
        subscribed: 'Active',
        information: ' and you can now have full access to the Ladder View.',
        color: '#4CAF50',
			  })
      : setData({
        subscribed: 'Inactive',
        information: ' and you have restricted access to Flash Betting.',
        color: '#F44336',
			  });
  }, [premiumMember]);

  return (
    <div className={classes.root}>
      <Header username={cookies.get('username')} premiumMember={premiumMember} classes={classes} />
      <div className={classes.subscriptionList}>
        {premiumMember ? null : (
          <>
            <SubscriptionContainer
              openPremiumDialog={openPremiumDialog}
              setSelectedPremium={setSelectedPremium}
              classes={classes}
            />
            <SubscriptionContainer
              plan="Biannually"
              price={49.99}
              color="green"
              openPremiumDialog={openPremiumDialog}
              setSelectedPremium={setSelectedPremium}
              classes={classes}
            />
            <SubscriptionContainer
              plan="Annually"
              price={99.99}
              openPremiumDialog={openPremiumDialog}
              setSelectedPremium={setSelectedPremium}
              classes={classes}
            />
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
