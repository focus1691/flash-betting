import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const AuthRedirect = props => {

  const [subscribedToWebApp, setSubscribedToWebApp] = useState(null);

  const redirectToBetFairOAuth = (status) => {
    if (status == 200) {
      fetch(`/api/get-subscription-status`)
        .then(subscribedToWebApp => {
          var isSubscribedToWebApp = subscribedToWebApp.val === 'true' ? true : false;
          setSubscribedToWebApp(isSubscribedToWebApp);
          if (setSubscribedToWebApp) window.location = "http://identitysso.betfair.com/view/vendor-login?client_id=74333&response_type=code&redirect_uri=validation";
        });
    }
  };

  useEffect(() => {
    var sessionKey = localStorage.getItem("sessionKey");
    if (!!sessionKey) {
      let email = localStorage.getItem("username");
      fetch(`/api/load-session?sessionKey=${encodeURIComponent(sessionKey)}&email=${email}`)
        .then(res => redirectToBetFairOAuth(res.status));
    }
  });
  return (
    <>
      {subscribedToWebApp === false ? <Redirect to='/login' /> : null}
      <section>Redirecting...</section>
    </>
  );
};

export default connect()(AuthRedirect);