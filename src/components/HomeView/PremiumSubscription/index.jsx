import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
//* @material-ui core
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
//* Custom Components
import SubscriptionContainer from './SubscriptionContainer';
//* Actions
import { openPremiumDialog } from '../../../redux/actions/settings';
//* JSS
import useStyles from '../../../jss/components/HomeView/premiumStyle';

const cookies = new Cookies();

const HomeView = ({ id, openPremiumDialog }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Box className={classes.backgroundFilter} />
      <Typography variant="h2" className={classes.title}>
        WELCOME TO FLASH BETTING
      </Typography>

      <div className={classes.statusChips}>
        <Chip className={classes.user} color="primary" label={`${cookies.get('username')} | ID ${id}`} />
      </div>

      <Typography variant="h2" className={classes.subtitle}>
        GO
        <img alt="Logout" src={`${window.location.origin}/icons/crown.svg`} />
        PREMIUM
      </Typography>
      <div className={classes.subscriptionList}>
        <SubscriptionContainer plan="Monthly" period="Per Month" price={5} openPremiumDialog={openPremiumDialog} classes={classes} />
        <SubscriptionContainer plan="Biannually" period="6 Months" price={25} openPremiumDialog={openPremiumDialog} classes={classes} />
        <SubscriptionContainer plan="Annually" period="1 Year" price={50} openPremiumDialog={openPremiumDialog} classes={classes} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  id: state.account.id,
});

const mapDispatchToProps = { openPremiumDialog };

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
