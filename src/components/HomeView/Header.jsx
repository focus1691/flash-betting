import React from 'react';
import Cookies from 'universal-cookie';
//* @material-ui core
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/HomeView/headerStyle';

const cookies = new Cookies();

export default ({ premiumMember }) => {
  const classes = useStyles({ subscribed: premiumMember });

  return (
    <div className={classes.header}>
      <Typography component="h2" className={classes.sectionHeader}>
        Dashboard
      </Typography>
      <div className={classes.statusChips}>
        <Chip className={classes.user} color="primary" label={`${cookies.get('username')} | Support ID 24442`} />
        <Chip className={classes.subscription} label={`Subscription: ${premiumMember ? 'Active' : 'Expired'}`} />
      </div>
    </div>
  );
};
