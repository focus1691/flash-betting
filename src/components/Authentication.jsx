import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const Authentication = () => {
  const [sessionKey] = useState(cookies.get('sessionKey'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authenticateUser = async () => {
      if (!sessionKey) return;
      const { vendorId, isSubscribed, accessToken } = await fetch('/api/get-subscription-status').then((res) => res.json());
      if (isSubscribed === false || !accessToken) {
        window.location = `http://identitysso.betfair.com/view/vendor-login?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
      } else {
        const {
          error, accessToken, refreshToken, expiresIn,
        } = await fetch('/api/request-access-token?tokenType=REFRESH_TOKEN').then((res) => res.json());

        if (error) {
          window.location.href = `${window.location.origin}/?error=${error.data ? error.data.AccountAPINGException.errorCode : 'GENERAL_AUTH_ERROR'}`;
        } else {

          setIsAuthenticated(true);
          window.location.href = `${window.location.origin}/dashboard`;
        }
      }
    };
    authenticateUser();
  }, []);
  return (
    <>
      {!sessionKey ? <Redirect to="/" />  : null }
      {isAuthenticated ? <Redirect to="/dashboard" /> : null}
      <section>Redirecting...</section>
    </>
  );
};

export default Authentication;
