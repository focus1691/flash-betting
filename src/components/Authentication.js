import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

const Authentication = props => {

  const [tokenGranted, setTokenGranted] = useState(null);

  useEffect(() => {
    if (!!localStorage.getItem("sessionKey")) {
      fetch(`/api/load-session?sessionKey=${encodeURIComponent(localStorage.getItem("sessionKey"))}&email=${localStorage.getItem("username")}`)
        .then(res => {
          fetch("/api/request-access-token?tokenType=REFRESH_TOKEN")
            .then(res => res.json())
            .then(data => {
              localStorage.setItem("accessToken", data.accessToken);
              localStorage.setItem("refreshToken", data.refreshToken);
              localStorage.setItem("expiresIn", data.expiresIn);
              setTokenGranted(true);
            });
        });
    }
  });
  return (
    <>
      {tokenGranted === true ? <Redirect to='/dashboard' /> : null}
      <section>Redirecting...</section>
    </>
  );
};

export default connect()(Authentication);