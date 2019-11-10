import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import * as actions from "../actions/account";
import getQueryVariable from "../utils/GetQueryVariable";
import { useCookies } from 'react-cookie';

const OAuthRedirect = props => {
    const [cookies, setCookie, removeCookie] = useCookies(['sessionKey', 'username', 'refreshToken', 'expiresIn']);

    useEffect(() => {
        var code = getQueryVariable("code");
        // var sessionKey =  localStorage.getItem("sessionKey");
        if (cookies.sessionKey) {
            fetch(`/api/load-session?sessionKey=${encodeURIComponent(cookies.sessionKey)}&email=${encodeURIComponent(cookies.username)}`)
            .then(res => {

              if (code && res.status === 200) {
                fetch(`/api/request-access-token?tokenType=AUTHORIZATION_CODE&code=${encodeURIComponent(code)}`)
                .then(res => res.json())
                .then(data => {

                  if (data.error) {
                    window.location.href = window.location.origin + `/?error=${data.error.message}`;
                    return;
                  }

                  setCookie('accessToken', data.accessToken);
                  setCookie('refreshToken', data.refreshToken);
                  setCookie('expiresIn', data.expiresIn);
                  props.onLogin(true);
                })
              } else {
                
              }
          });
      }
    }, []);

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
  