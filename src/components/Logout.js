import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';

const Logout = props => {

    const [loggedIn, setLoggedIn] = useState(true);

    useEffect(() => {
        props.socket.emit('logout');

        props.socket.on('logged_out', (err) => {
            // handle if error on logout
            if (err) {
                
            } else {
                localStorage.removeItem("sessionKey");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("expiresIn");
                setLoggedIn(false);
            }
        });
    });

    return (
        <>
        { loggedIn === false ? <Redirect to='/login' /> : null }
        <section>Logging out...</section>
        </>
      );
}

const LogoutWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <Logout {...props} socket={socket} />}
	</SocketContext.Consumer>
);

export default connect()(LogoutWithSocket);