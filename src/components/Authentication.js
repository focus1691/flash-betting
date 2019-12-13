import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Authentication = props => {
  const [cookies, setCookie] = useCookies(['sessionKey', 'username', 'refreshToken', 'expiresIn']);
  const [isSubscribed, setSubscribed] = useState(null);
  const [tokenGranted, setTokenGranted] = useState(null);

  useEffect(() => {
    if (cookies.sessionKey) {
      fetch(`/api/load-session?sessionKey=${encodeURIComponent(cookies.sessionKey)}&email=${cookies.username}`)
        .then(res => {
          fetch("/api/get-subscription-status")
            .then(res => res.json())
            .then(res => {
              setSubscribed(res.isSubscribed);

              if (isSubscribed === false || !res.accessToken) {
                window.location = "http://identitysso.betfair.com/view/vendor-login?client_id=74333&response_type=code&redirect_uri=validation";
              } else {
                fetch("/api/request-access-token?tokenType=REFRESH_TOKEN")
                  .then(res => res.json())
                  .then(res => {
                    if (res.error) {
                      props.onLogin(false);
                      window.location.href = window.location.origin + "/?error=" + (res.error.data ? res.error.data.AccountAPINGException.errorCode : "GENERAL_AUTH_ERROR");
                    } else {
                      setCookie('accessToken', res.accessToken);
                      setCookie('refreshToken', res.refreshToken);
                      setCookie('expiresIn', res.expiresIn);

                      setTokenGranted(true);
                      window.location.href = window.location.origin + '/dashboard';
                    }
                  });
              }
            });
        });
    }
  });
  return (
    <>
      {tokenGranted === true && isSubscribed === true ? <Redirect to='/dashboard' /> : null}
      <section>Redirecting...</section>
    </>
  );
};

export default connect()(Authentication);