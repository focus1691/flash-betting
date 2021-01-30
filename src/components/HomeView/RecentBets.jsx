import React, { useState, useEffect } from 'react';
//* @material-ui core
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/HomeView/recentBetsStyle';

export default () => {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  return (
    <div className={classes.container}>
      <Typography component="h2" className={classes.sectionHeader}>
        Recent Bets
      </Typography>
    </div>
  );
};
