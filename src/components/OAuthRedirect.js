import React, {useState, useEffect} from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import SocketContext from '../SocketContext';

const OAuthRedirect = props => {

    const [accessToken, setAccessToken] = useState(null);

    props.socket.emit("load_session", { sessionKey: localStorage.getItem("sessionKey") });
    
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
         }
         return(false);
    }

    useEffect(() => {
        var code = getQueryVariable("code");
        if (code) {
            var sessionKey = localStorage.getItem("sessionKey");
            props.socket.emit('request_access_token', code);
        }

        props.socket.on('access_token', token => {
            localStorage.setItem("accessToken", token);
            setAccessToken(token);
        });
    });

    if (!!accessToken) {
        return <Redirect to='/dashboard' />
    }

    return (<section>Redirecting...</section>);
};

const OAuthRedirectWithSocket = props => (
	<SocketContext.Consumer>
		{socket => <OAuthRedirect {...props} socket={socket} />}
	</SocketContext.Consumer>
);

export default connect()(OAuthRedirectWithSocket);