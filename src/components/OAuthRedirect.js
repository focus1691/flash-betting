import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from "../actions/account";

const OAuthRedirect = props => {


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
        if (code && status === 200) {
            fetch(`/api/request-access-token?code=${encodeURIComponent(code)}`)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("expiresIn", data.expiresIn);
                // setAccessToken(data.accessToken);
                props.onLogin(true);
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

    if (props.loggedIn) {
        return <Redirect to='/dashboard' />
    } else {
        return (<section>Redirecting...</section>);
    }
};

const mapStateToProps = state => {
    return {
      loggedIn: state.account.loggedIn
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      onLogin: loggedIn => dispatch(actions.setLoggedIn(loggedIn))
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(OAuthRedirect);
  