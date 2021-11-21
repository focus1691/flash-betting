import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Spinner from './App/Spinner';
//* HTTP
import fetchData, { fetchSecureData, isTokenExpired } from '../http/fetchData';
//* Constants
import { FLASH_BETTING_URL } from '../constants';

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
          const authToken = cookies.get('token');
          const vendorClientId = await fetchData('/api/get-vendor-client-id');

          console.log(authToken, vendorClientId);

          if (vendorClientId && !!authToken && !isTokenExpired(authToken)) {
            const response = await fetchSecureData(`${FLASH_BETTING_URL}refresh-access-token?vendorClientId=${vendorClientId}`, authToken);
            if (response.ok) {
              setIsAuthenticated(true);
            }
          }
        }
      }
    })();
  }, []);
  return !sessionKey ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default Authentication;
