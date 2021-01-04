import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
//* @material-ui core
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { openPremiumDialog, setSelectedPremium } from '../../actions/settings';
import SocketContext from '../../SocketContext';
import Header from './Header';
import SubscriptionContainer from './SubscriptionContainer';
import useStyles from '../../jss/components/HomeView/homeViewStyle';

const cookies = new Cookies();

const HomeView = ({ premiumMember, openPremiumDialog, setSelectedPremium }) => {
  const [data, setData] = useState({});
  const classes = useStyles({ subscribed: premiumMember });
  console.log(openPremiumDialog);

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
      <div className={classes.homeView}>
        <Header username={cookies.get('username')} premiumMember={premiumMember} classes={classes} />
        <Divider className={classes.divider} />
        <Grid container alignItems="center">
          <Typography className={classes.subheading} variant="h5">
            Flash Betting Membership is
            {' '}
            <span style={{ color: data.color }}>{data.subscribed}</span>
          </Typography>
        </Grid>
        <Grid container alignItems="center">
          <Typography className={classes.premiumStatus} gutterBottom variant="h6">
            Your Flash Betting Membership is
            {' '}
            <span>{data.subscribed}</span>
          </Typography>
          <Typography variant="body1">{data.information}</Typography>
        </Grid>
        <Grid container alignItems="center">
          <Typography className={classes.textMargin} gutterBottom variant="body1">
            Contact us on
            {' '}
            <a href="mailto:joshbetting30@yahoo.com">joshbetting30@yahoo.com</a>
            {' '}
            if you experience any
            issues when using Flash Betting.
          </Typography>
        </Grid>
        <Divider className={classes.divider} />
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  premiumMember: state.settings.premiumMember,
});

const mapDispatchToProps = { openPremiumDialog, setSelectedPremium };

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
