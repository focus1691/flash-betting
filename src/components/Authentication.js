import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Authentication = props => {

  const [isSubscribed, setSubscribed] = useState(null);
  const [tokenGranted, setTokenGranted] = useState(null);

  useEffect(() => {
    if (!!localStorage.getItem("sessionKey")) {
      fetch(`/api/load-session?sessionKey=${encodeURIComponent(localStorage.getItem("sessionKey"))}&email=${localStorage.getItem("username")}`)
        .then(res => {
          fetch("/api/get-subscription-status")
            .then(res => res.json())
            .then(res => {
              setSubscribed(res.isSubscribed);

              if (isSubscribed === false) {
                window.location = "http://identitysso.betfair.com/view/vendor-login?client_id=74333&response_type=code&redirect_uri=validation";
              } else {
                fetch("/api/request-access-token?tokenType=REFRESH_TOKEN")
                  .then(res => res.json())
                  .then(res => {
                    localStorage.setItem("accessToken", res.accessToken);
                    localStorage.setItem("refreshToken", res.refreshToken);
                    localStorage.setItem("expiresIn", res.expiresIn);
                    setTokenGranted(true);
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