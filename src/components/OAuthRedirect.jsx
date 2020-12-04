import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import getQueryVariable from '../utils/Market/GetQueryVariable';

const OAuthRedirect = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const applyCode = async () => {
      const code = getQueryVariable('code');
      if (!code) return;

      const {
        error, accessToken, refreshToken, expiresIn,
      } = await fetch(`/api/request-access-token?tokenType=AUTHORIZATION_CODE&code=${encodeURIComponent(code)}`);

      if (error) {
        window.location.href = `${window.location.origin}/?error=${error.data ? error.data.AccountAPINGException.errorCode : 'GENERAL_AUTH_ERROR'}`;
      } else {
        setIsAuthenticated(true);
      }
    };
    applyCode();
  }, []);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (<section>Redirecting...</section>);
};

export default OAuthRedirect;
