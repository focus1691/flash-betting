import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
//* @material-ui core
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
//* Actions
import { setUserId } from '../../actions/account';
//* JSS
import useStyles from '../../jss/components/HomeView/headerStyle';
//* HTTP
import fetchData from '../../http/fetchData';

const cookies = new Cookies();

const Header = ({ premiumMember, id, setUserId }) => {
  const classes = useStyles({ subscribed: premiumMember });

  useEffect(() => {
    (async () => {
      const vendorClientId = await fetchData('/api/get-vendor-client-id');
      setUserId(vendorClientId);
    })();
  }, []);

  return (
    <div className={classes.header}>
      <Typography component="h2" className={classes.sectionHeader}>
        Dashboard
      </Typography>
      <div className={classes.statusChips}>
        <Chip className={classes.user} color="primary" label={`${cookies.get('username')} | ID ${id}`} />
        <Chip className={classes.subscription} label={`Subscription: ${premiumMember ? 'Active' : 'Expired'}`} />
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ id: state.account.id });

const mapDispatchToProps = { setUserId };

export default connect(mapStateToProps, mapDispatchToProps)(Header);
