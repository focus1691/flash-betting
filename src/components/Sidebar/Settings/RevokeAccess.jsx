import React from 'react';
//* @material-ui core
import useStyles from '../../../jss/components/Sidebar/settings/revokeAccessStyle';
//* HTTP
import fetchData from '../../../http/fetchData';

export default () => {
  const classes = useStyles();

  const handleRevokeAccess = async () => {
    const result = await fetchData('/api/revoke-subscription-status');
    const { error } = result;
    console.log(error, result);

  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <span align="center" className={classes.title}>Revoke Access</span>
      </div>
      <div className={classes.body}>
        <span align="center" className={classes.text}>Do you want to revoke access to Flash Betting?</span>
        <div className={classes.buttons}>
          <button type="button" className={classes.revokeBtn} onClick={handleRevokeAccess}>
            YES
          </button>
        </div>
      </div>
    </div>
  );
};
