import React from 'react';
//* @material-ui core
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

export default ({ plan, period, price, openPremiumDialog, setSelectedPremium, classes }) => (
  <div className={classes.subscriptionContainer}>
    <div className={classes.subscriptionHeader}>{plan}</div>
    <Divider variant="middle" />
    <p className={classes.subscriptionPrice}>{`£${price}`}</p>
    <p className={classes.subscriptionPeriod}>{period}</p>
    <Button
      className={classes.subscriptionButton}
      onClick={() => {
        openPremiumDialog(true);
        setSelectedPremium(plan.toLowerCase());
      }}
    >
      SIGN UP
    </Button>
  </div>
);
