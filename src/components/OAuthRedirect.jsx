import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setLoggedIn } from '../actions/account';
import getQueryVariable from '../utils/Market/GetQueryVariable';

const OAuthRedirect = ({ loggedIn, setLoggedIn }) => {
  const [cookies, setCookie] = useCookies(['sessionKey', 'username', 'refreshToken', 'expiresIn']);

  useEffect(() => {
    const code = getQueryVariable('code');
    if (cookies.sessionKey) {
      if (code) {
        fetch(`/api/request-access-token?tokenType=AUTHORIZATION_CODE&code=${encodeURIComponent(code)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setLoggedIn(false);
              window.location.href = `${window.location.origin}/?error=${data.error.data ? data.error.data.AccountAPINGException.errorCode : 'GENERAL_AUTH_ERROR'}`;
            } else {
              setCookie('accessToken', data.accessToken);
              setCookie('refreshToken', data.refreshToken);
              setCookie('expiresIn', data.expiresIn);
              setLoggedIn(true);
            }
          });
      }
    }
  }, []);

  if (loggedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (<section>Redirecting...</section>);
};

const mapStateToProps = (state) => ({
  loggedIn: state.account.loggedIn,
});

const mapDispatchToProps = { setLoggedIn };

export default connect(mapStateToProps, mapDispatchToProps)(OAuthRedirect);
