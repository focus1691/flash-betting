import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
//* HTTP
import fetchData from '../http/fetchData';

const cookies = new Cookies();

const Authentication = () => {
  const [sessionKey] = useState(cookies.get('sessionKey'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      if (sessionKey) {
        const { vendorId, isSubscribed, accessToken } = await fetchData('/api/get-subscription-status');
        if (isSubscribed === false || !accessToken) {
          window.location = `http://identitysso.betfair.com/view/vendor-login?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
        } else {
          const { error } = await fetchData('/api/request-access-token?tokenType=REFRESH_TOKEN');

          if (!error) {
            setIsAuthenticated(true);
          }
        }
      }
    })();
  }, []);
  return !sessionKey ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <section>Redirecting...</section>;
};

export default Authentication;
