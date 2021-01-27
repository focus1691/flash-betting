import React from 'react';
//* @material-ui core
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';

export default ({ username, premiumMember, classes }) => (
  <Grid container alignItems="center">
    <Grid item lg container justify="flex-end">
      <Chip className={classes.username} color="primary" label={`${username} | Support ID 24442`} />
      <Chip
        className={classes.subscription}
        label={`Subscription: ${premiumMember ? 'Active' : 'Expired'}`}
      />
    </Grid>
  </Grid>
);
