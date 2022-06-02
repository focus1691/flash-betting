import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
//* @material-ui core
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
//* JSS
import useStyles from '../../jss/components/HomeView/headerStyle';

const cookies = new Cookies();

const Header = ({ premiumMember, id }) => {
  const classes = useStyles({ subscribed: premiumMember });

  return (
    <div className={classes.header}>
      <Typography component="h2" className={classes.sectionHeader}>
        Dashboard
      </Typography>
      <div className={classes.statusChips}>
        <Chip
          className={classes.user}
          color="primary"
          label={(
            <>
              <span>{cookies.get('username')}</span>
              {' '}
              <span>|</span>
              {' '}
              <span>ID</span>
              {' '}
              <span className={classes.username}>{id}</span>
            </>
          )}
        />
        <Chip className={classes.subscription} label={`Subscription: ${premiumMember ? 'Active' : 'Expired'}`} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ id: state.account.id });

export default connect(mapStateToProps)(Header);
