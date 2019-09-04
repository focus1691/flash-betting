import React, {useState, useEffect} from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const OAuthRedirect = props => {

    const [accessToken, setAccessToken] = useState(null);

    const getQueryVariable = variable => {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
        if(pair[0] === variable){return pair[1];}
         }
         return(false);
    };

    const setTokenInformation = (code, status) => {
        if (code && status === '200') {
            fetch(`/api/request-access-token?code=${encodeURIComponent(code)}`)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("expiresIn", data.expiresIn);
                setAccessToken(data.accessToken);
            });
        }
    };

    useEffect(() => {
        var code = getQueryVariable("code");

        var sessionKey = localStorage.getItem("sessionKey");
        if (!!sessionKey) {
            let sessionKey = localStorage.getItem("sessionKey");
            let email = localStorage.getItem("username");
            fetch(`/api/load-session?sessionKey=${encodeURIComponent(sessionKey)}&email=${encodeURIComponent(email)}`)
            .then(res => setTokenInformation(code, res.status));
        }
    });

    if (!!accessToken) {
        return <Redirect to='/dashboard' />
    }

    return (<section>Redirecting...</section>);
};

export default connect()(OAuthRedirect);