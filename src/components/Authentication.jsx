import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Spinner from './App/Spinner';
//* HTTP
import fetchData, { fetchSecureData, isTokenExpired } from '../http/fetchData';
//* Utils
import { clearCookies } from '../session/cleanup';
//* Constants
import { FLASH_BETTING_URL } from '../constants';

const cookies = new Cookies();

const Authentication = () => {
  const [sessionKey, setSessionKey] = useState(cookies.get('sessionKey'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const resetSession = () => {
      clearCookies();
      setSessionKey(null);
    };

    (async () => {
      if (sessionKey) {
        const isRegistered = await fetchData('/api/registration-status');

        if (isRegistered === false) {
          // Not registered so go straight to O-Auth
          const { vendorId } = await fetchData('/api/vendor-id');
          window.location = `http://identitysso.betfair.com/view/vendor-login?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
        }
        else if (isRegistered === true) {
          // Authenticate user to create the token
          const { error } = await fetchData('/api/authenticate-user');
          if (error) {
            resetSession();
          } else {
            const { vendorId, isSubscribed, accessToken } = await fetchData('/api/get-subscription-status');
            if (isSubscribed === false || !accessToken) {
              window.location = `http://identitysso.betfair.com/view/vendor-login?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
            } else {
              const authToken = cookies.get('token');
              const vendorClientId = await fetchData('/api/get-vendor-client-id');

              if (vendorClientId && !!authToken && !isTokenExpired(authToken)) {
                const response = await fetchSecureData(`${FLASH_BETTING_URL}refresh-access-token?vendorClientId=${vendorClientId}`, authToken);
                if (response && response.ok) {
                  setIsAuthenticated(true);
                }
              }
            }
          }
        } else {
          resetSession();
        }
      }
    })();
  }, []);
  return !sessionKey ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default Authentication;
