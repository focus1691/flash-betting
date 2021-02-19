import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import getQueryVariable from '../utils/Market/GetQueryVariable';
import Spinner from './App/Spinner';
//* HTTP
import fetchData from '../http/fetchData';

const cookies = new Cookies();

const OAuthRedirect = () => {
  const [isError, setIsError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    (async () => {
      const code = getQueryVariable('code');
      if (!code) return;
      const { error } = await fetchData(`http://localhost:3000/generate-access-token?code=${encodeURIComponent(code)}`);

      if (error) {
        cookies.remove('username');
        cookies.remove('sessionKey');
        cookies.remove('accessToken');
        setIsError(true);
      } else {
        setIsAuthenticated(true);
      }
    })();
  }, []);

  return isError ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default OAuthRedirect;
