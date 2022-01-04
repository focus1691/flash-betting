import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import getQueryVariable from '../utils/Market/GetQueryVariable';
import Spinner from './App/Spinner';
//* HTTP
import fetchData, { fetchSecureData } from '../http/fetchData';
//* Constants
import { FLASH_BETTING_URL } from '../constants';
//* Session
import { clearCookies } from '../session/cleanup';

const cookies = new Cookies();

const OAuthRedirect = () => {
  const [isError, setIsError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const resetSession = () => {
      clearCookies(cookies);
      setIsError(true);
    };

    (async () => {
      let errorOccurred = false;
      try {
        const code = getQueryVariable('code');
        const email = cookies.get('username');
        if (!code || !email) {
          setIsError(true);
          return;
        }
        const authToken = cookies.get('token');
        const response = await fetchSecureData(`${FLASH_BETTING_URL}generate-access-token?code=${encodeURIComponent(code)}&email=${email}`, authToken);

        if (response && response.ok) {
          const { error } = await fetchData('/api/authenticate-user');

          if (error) {
            errorOccurred = true;
          } else {
            setIsAuthenticated(true);
          }
        } else {
          errorOccurred = true;
        }
      } catch (error) {
        console.log(`ERROR: O-Auth ${error}`);
      } finally {
        if (errorOccurred) {
          resetSession();
        }
      }
    })();
  }, []);

  return isError ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default OAuthRedirect;
