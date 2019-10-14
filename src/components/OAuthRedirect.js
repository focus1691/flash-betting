import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from "../actions/account";
import getQueryVariable from "../utils/GetQueryVariable";

const OAuthRedirect = props => {
    useEffect(() => {
        var code = getQueryVariable("code");

        var sessionKey = localStorage.getItem("sessionKey");
        if (!!sessionKey) {
            fetch(`/api/load-session?sessionKey=${encodeURIComponent(localStorage.getItem("sessionKey"))}&email=${encodeURIComponent(localStorage.getItem("username"))}`)
            .then(res => {
              if (code && res.status === 200) {
                fetch(`/api/request-access-token?tokenType=AUTHORIZATION_CODE&code=${encodeURIComponent(code)}`)
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);
                    localStorage.setItem("expiresIn", data.expiresIn);
                    // setAccessToken(data.accessToken);
                    props.onLogin(true);
                });
            }
        });
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
  