import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Spinner from './App/Spinner';
//* HTTP
import fetchData from '../http/fetchData';
//* Utils
import { clearCookies } from '../session/cleanup';
//* Constants
import { BETFAIR_LOGIN_PAGE } from '../constants';

const cookies = new Cookies();

const Authentication = () => {
  const [sessionKey, setSessionKey] = useState(cookies.get('sessionKey'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const resetSession = () => {
      clearCookies(cookies);
      setSessionKey(null);
    };

    (async () => {
      if (sessionKey) {
        let errorOccurred = false;
        try {
          const isRegistered = await fetchData('/api/registration-status');
          const { vendorId } = await fetchData('/api/vendor-id');

          if (!vendorId) {
            errorOccurred = true;
          }

          if (isRegistered === false && !errorOccurred) {
            // Not registered so go straight to O-Auth
            window.location = `${BETFAIR_LOGIN_PAGE}?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
          } else if (isRegistered === true && !errorOccurred) {
            // Authenticate user to create the JWT token / retrieve the user's access token
            const { error } = await fetchData('/api/authenticate-user');
            if (error) {
              errorOccurred = true;
            } else {
              const { isSubscribed, error } = await fetchData('/api/get-subscription-status');
              if (isSubscribed === false || error) {
                window.location = `${BETFAIR_LOGIN_PAGE}?client_id=${vendorId}&response_type=code&redirect_uri=validation`;
              } else if (isSubscribed === true) {
                setIsAuthenticated(true);
              } else {
                errorOccurred = true;
              }
            }
          }
        } catch (error) {
          console.log(`ERROR: Authentication ${error}`);
          errorOccurred = true;
        } finally {
          if (errorOccurred) {
            resetSession();
          }
        }
      }
    })();
  }, []);
  return !sessionKey ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default Authentication;
