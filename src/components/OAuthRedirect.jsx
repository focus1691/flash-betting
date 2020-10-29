import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setLoggedIn } from '../actions/account';
import getQueryVariable from '../utils/Market/GetQueryVariable';

const OAuthRedirect = ({ loggedIn, setLoggedIn }) => {
  const [cookies, setCookie] = useCookies(['sessionKey', 'username', 'refreshToken', 'expiresIn']);

  useEffect(() => {
    const applyCode = async () => {
      const code = getQueryVariable('code');
      if (!code) return;

      const {
        error, accessToken, refreshToken, expiresIn,
      } = await fetch(`/api/request-access-token?tokenType=AUTHORIZATION_CODE&code=${encodeURIComponent(code)}`);

      if (error) {
        setLoggedIn(false);
        window.location.href = `${window.location.origin}/?error=${error.data ? error.data.AccountAPINGException.errorCode : 'GENERAL_AUTH_ERROR'}`;
      } else {
        setCookie('accessToken', accessToken);
        setCookie('refreshToken', refreshToken);
        setCookie('expiresIn', expiresIn);
        setLoggedIn(true);
      }
    };
    applyCode();
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
