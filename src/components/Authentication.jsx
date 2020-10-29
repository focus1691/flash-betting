import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const CLIENT_ID = 74333;

const Authentication = (props) => {
  const [cookies, setCookie] = useCookies(['sessionKey', 'username', 'refreshToken', 'expiresIn']);
  const [isSubscribed, setSubscribed] = useState(null);
  const [tokenGranted, setTokenGranted] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      if (!cookies.sessionKey) return;
      const { isSubscribed, accessToken } = await fetch('/api/get-subscription-status').then((res) => res.json());
      setSubscribed(isSubscribed);
      if (isSubscribed === false || !accessToken) {
        window.location = `http://identitysso.betfair.com/view/vendor-login?client_id=${CLIENT_ID}&response_type=code&redirect_uri=validation`;
      } else {
        const {
          error, accessToken, refreshToken, expiresIn,
        } = await fetch('/api/request-access-token?tokenType=REFRESH_TOKEN').then((res) => res.json());

        if (error) {
          props.onLogin(false);
          window.location.href = `${window.location.origin}/?error=${error.data ? error.data.AccountAPINGException.errorCode : 'GENERAL_AUTH_ERROR'}`;
        } else {
          setCookie('accessToken', accessToken);
          setCookie('refreshToken', refreshToken);
          setCookie('expiresIn', expiresIn);

          setTokenGranted(true);
          window.location.href = `${window.location.origin}/dashboard`;
        }
      }
    };
    authenticateUser();
  }, []);
  return (
    <>
      {tokenGranted === true && isSubscribed === true ? <Redirect to="/dashboard" /> : null}
      <section>Redirecting...</section>
    </>
  );
};

export default connect()(Authentication);
