import React from 'react';
import Cookies from 'universal-cookie';
//* @material-ui core
import useStyles from '../../../jss/components/Sidebar/settings/revokeAccessStyle';
//* HTTP
import fetchData from '../../../http/fetchData';
//* Utils
import { clearCookies, redirectToLogin } from '../../../session/cleanup';

const cookies = new Cookies();

export default () => {
  const classes = useStyles();

  const handleRevokeAccess = async () => {
    const result = await fetchData('/api/revoke-subscription-status');

    if (result === 'SUCCESS') {
      clearCookies(cookies);
      redirectToLogin();
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <span align="center" className={classes.title}>
          Revoke Access
        </span>
      </div>
      <div className={classes.body}>
        <span align="center" className={classes.text}>
          Do you want to revoke access to Flash Betting?
        </span>
        <div className={classes.buttons}>
          <button type="button" className={classes.revokeBtn} onClick={handleRevokeAccess}>
            YES
          </button>
        </div>
      </div>
    </div>
  );
};
