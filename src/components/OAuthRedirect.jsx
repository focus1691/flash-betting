import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import getQueryVariable from '../utils/Market/GetQueryVariable';
import Spinner from './App/Spinner';
//* HTTP
import fetchData from '../http/fetchData';

const cookies = new Cookies();

const OAuthRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    (async () => {
      const code = getQueryVariable('code');
      if (!code) return;

      const { error } = await fetchData(`/api/request-access-token?tokenType=AUTHORIZATION_CODE&code=${encodeURIComponent(code)}`);

      if (error) {
        setIsAuthenticated(null);
        cookies.remove('username');
        cookies.remove('sessionKey');
        cookies.remove('accessToken');
      } else {
        setIsAuthenticated(true);
      }
    })();
  }, []);

  return isAuthenticated === null ? <Redirect to="/" /> : isAuthenticated ? <Redirect to="/dashboard" /> : <Spinner />;
};

export default OAuthRedirect;
