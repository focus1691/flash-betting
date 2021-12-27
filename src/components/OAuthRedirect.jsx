import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import getQueryVariable from '../utils/Market/GetQueryVariable';
import Spinner from './App/Spinner';
//* Constants
import { FLASH_BETTING_URL } from '../constants';
//* Session
import { clearCookies } from '../session/cleanup';

const cookies = new Cookies();

const OAuthRedirect = () => {
  const [isError, setIsError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    (async () => {
      const code = getQueryVariable('code');
      const email = cookies.get('username');
      if (!code || !email) {
        setIsError(true);
        return;
      }
      const response = await fetch(`${FLASH_BETTING_URL}generate-access-token?code=${encodeURIComponent(code)}&email=${email}`);

      if (response && response.ok) {
        setIsAuthenticated(true);
      } else {
        clearCookies(cookies);
        setIsError(true);
      }
    })();
  }, []);

  return isError ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default OAuthRedirect;
