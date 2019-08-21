import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';

const AuthRedirect = props => {

  const [subscribedToWebApp, setSubscribedToWebApp] = useState(null);

  props.socket.emit('load_session', {sessionKey: localStorage.getItem("sessionKey")});

  useEffect(() => {

    props.socket.emit('get_subscription_status');

    props.socket.on('subscription_status', subscribedToWebApp => {
      var isSubscribedToWebApp = subscribedToWebApp === 'true' ? true : false;
      console.log(subscribedToWebApp, isSubscribedToWebApp);
      setSubscribedToWebApp(isSubscribedToWebApp);
      if (setSubscribedToWebApp) window.location = "http://identitysso.betfair.com/view/vendor-login?client_id=74333&response_type=code&redirect_uri=validation";
    });
  });
  return (
    <>
    { subscribedToWebApp === false ? <Redirect to='/login' /> : null }
    <section>Redirecting...</section>
    </>
  );
};

const AuthRedirectWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <AuthRedirect {...props} socket={socket} />}
	</SocketContext.Consumer>
);

export default connect()(AuthRedirectWithSocket);